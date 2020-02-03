import React, { useEffect, useState, useRef } from 'react';
import { Header, Grid, Table } from 'semantic-ui-react';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'
import Moment from 'react-moment';

const BLOCKS_LIMIT = 20
const MAX_ROW = 5

export default function Charts() {
  return (
    <>
      <Header as="h1">Charts</Header>
      <LiveBlocks />
    </>
  )
}

function LiveBlocks() {
  const [blocks, setBlocks] = useState([])
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://44.224.32.162:4000")
    ws.current.onmessage = msg => {
      console.log(msg)
      setBlocks(prev => {
        const l = prev.length
        if (l >= BLOCKS_LIMIT) {
          return [...prev.slice(1, l), JSON.parse(msg.data)]
        }
        return [...prev, JSON.parse(msg.data)]
      })
    }

    return () => ws.close()
  }, [])

  const rows = [...blocks].reverse().map((block, i) => {
    const details = JSON.parse(block.value)
    const l = details.hash.length
    const receivedDate = new Date(block.timestamp)
    const blockDate = new Date(parseInt(details.time) * 1000)
    return (
      <Table.Row key={details.hash} positive={i === 0}>
        <Table.Cell>{details.hash.substring(l - 10)}</Table.Cell>
        <Table.Cell>{details.height}</Table.Cell>
        <Table.Cell>{details.nTx}</Table.Cell>
        <Table.Cell>{details.miner}</Table.Cell>
        <Table.Cell>
          <Moment date={blockDate} format="MM/DD/YYYY hh:mm:ss A" />
        </Table.Cell>
        <Table.Cell>
          <Moment date={receivedDate} format="MM/DD/YYYY hh:mm:ss A" />
        </Table.Cell>
      </Table.Row>
    )
  })

  const plots = blocks.map(block => {
    const details = JSON.parse(block.value)
    return { x: parseInt(details.height), y: details.nTx }
  })

  return (
    <>
      <Header as="h2">Live Blocks</Header>
      <Grid>
        <Grid.Column width={16}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={1200}
            height={300}
          >
            <VictoryLine
              data={plots}
              animate={{ duration: 500 }}
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" }
              }}
            />
          </VictoryChart>
        </Grid.Column>
      </Grid>

      <Table fixed singleLine={false}
        style={{ maxHeight: '300px', overFlow: 'scroll' }}
      >
        <Table.Header>
          <Table.Row key="header_row">
            <Table.HeaderCell width={3}>Hash (Last 10 chars)</Table.HeaderCell>
            <Table.HeaderCell width={1}>Height</Table.HeaderCell>
            <Table.HeaderCell width={1}>#Tx</Table.HeaderCell>
            <Table.HeaderCell width={5}>Miner</Table.HeaderCell>
            <Table.HeaderCell width={3}>Block Time</Table.HeaderCell>
            <Table.HeaderCell width={3}>Received At</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.slice(0, MAX_ROW)}
        </Table.Body>
      </Table>

    </>
  )
}