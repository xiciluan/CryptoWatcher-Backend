import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Header, Grid, Table, Dimmer, Loader } from 'semantic-ui-react';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'
import Moment from 'react-moment';
import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

const BLOCKS_LIMIT = 20
const MAX_ROW = 5

const LATEST_BLOCKS = gql`
  {
    latestBlocks {
      hash
      height
      nTx
      miner
      time
    }
  }
`

export default function LiveCharts() {
  const {loading, error, data} = useQuery(LATEST_BLOCKS)

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  }

  const initData = [...data.latestBlocks].reverse().map(b => {
    b.timestamp = new Date()
    return b
  });
  console.log(initData)
  return (    
    <>
      <Header as="h1">Live Charts</Header>
      <LiveBlocks initData={initData} />
    </>
  )
}

function LiveBlocks({initData}) {
  const [blocks, setBlocks] = useState(initData)
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://44.224.32.162:4000")
    ws.current.onmessage = msg => {
      console.log(msg)
      setBlocks(prev => {
        const l = prev.length
        const dataObj = JSON.parse(msg.data)
        const data = {
          ...dataObj,
          ...JSON.parse(dataObj.value)
        }
        if (l >= BLOCKS_LIMIT) {
          return [...prev.slice(1, l), data]
        }
        return [...prev, data]
      })
    }
    return () => ws.current.close()
  }, [])

  const rows = [...blocks].reverse().map((block, i) => {
    const l = block.hash.length
    const receivedDate = new Date(block.timestamp)
    const blockDate = new Date(parseInt(block.time) * 1000)
    return (
      <Table.Row key={block.hash} positive={i === 0}>
        <Table.Cell>...{block.hash.substring(l - 10)}</Table.Cell>
        <Table.Cell>{block.height}</Table.Cell>
        <Table.Cell>{block.nTx}</Table.Cell>
        <Table.Cell>{block.miner}</Table.Cell>
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
    return { x: parseInt(block.height), y: block.nTx }
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
            <Table.HeaderCell width={2}>Hash</Table.HeaderCell>
            <Table.HeaderCell width={2}>Height</Table.HeaderCell>
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