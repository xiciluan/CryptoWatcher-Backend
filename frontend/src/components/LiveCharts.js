import React, { useEffect, useState, useRef } from 'react';
import { Button, Container, Header, Grid, Table, Dimmer, Loader, Divider, Icon } from 'semantic-ui-react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory'
import Moment from 'react-moment';
import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';
import {
  Link,
} from "react-router-dom";


const BLOCKS_LIMIT = 20
const MONITOR_LIMIT = 20
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

const LATEST_MONITORING = gql`
  {
    latestMonitorData {
      time
      gini_index
      max_hash_rate
    }
  }
`

export default function LiveCharts() {
  const { loading: blocksLoading, error: err1, data: blocksData } = useQuery(LATEST_BLOCKS)
  const { loading: monitorLoading, error: err2, data: monitorData } = useQuery(LATEST_MONITORING)

  if (err1 || err2) {
    return (
      <Dimmer active inverted page>
        <Container text textAlign="center">
          <Header as="h2">GraphQL backend server is currently paused<Icon name='ban' /></Header>
          <Header as="h2">Please come back later</Header>
          <Button as={Link} to="/">Go to Home</Button>
        </Container>
      </Dimmer>
    )
  }

  if (blocksLoading || monitorLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  }
  let initData;
  if (blocksData) {
    initData = [...blocksData.latestBlocks].reverse().map(b => {
      b.timestamp = new Date()
      return b
    });
  }

  let initMonitorData;
  if (monitorData) {
    initMonitorData = [...monitorData.latestMonitorData].reverse().map(m => {
      m.timestamp = new Date()
      return m
    })
  }

  return (
    <>
      <Header as="h1">Live Charts</Header>
      <DataDisplay initData={initData} initMonitorData={initMonitorData} />
    </>
  )
}

function DataDisplay({ initData, initMonitorData }) {
  const [blocks, setBlocks] = useState(initData)
  const [monitoring, setMonitoring] = useState(initMonitorData)
  const ws = useRef(null)
  const times = useRef(monitoring.map(m => m.time))

  useEffect(() => {
    ws.current = new WebSocket('ws://api.artofdata.me/ws/')
    ws.current.onerror = e => {
      return (
        <Dimmer active inverted>
          <Container text textAlign="center">
            <Header as="h2">Websocket backend server is currently paused<Icon name='ban' /></Header>
            <Header as="h2">Please come back later</Header>
            <Button as={Link} to="/">Go to Home</Button>
          </Container>
        </Dimmer>
      )
    }
    ws.current.onmessage = msg => {
      const dataObj = JSON.parse(msg.data)
      if (dataObj.source === 'block') {
        setBlocks(prev => {
          const l = prev.length
          const data = {
            ...JSON.parse(dataObj.value),
            timestamp: new Date()
          }
          if (l >= BLOCKS_LIMIT) {
            return [...prev.slice(1, l), data]
          }
          return [...prev, data]
        })
      } else if (dataObj.source === 'monitor_data') {
        if (times.current.indexOf(dataObj[0].time) < 0) {
          setMonitoring(prev => {
            const l = prev.length
            const data = {
              ...dataObj[0],
              timestamp: new Date()
            }
            const orig = [...times.current]
            if (l >= MONITOR_LIMIT) {

              times.current = [...orig.slice(1, l), dataObj[0].time]
              return [...prev.slice(1, l), data]
            }
            times.current = [...orig, dataObj[0].time]
            return [...prev, data]
          })
        }
      }

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

  const monitor_rows = [...monitoring].reverse().map((m, i) => {
    const receivedDate = new Date(m.timestamp)
    const date = new Date(m.time * 1000)
    return (
      <Table.Row key={m.time} positive={i === 0}>
        <Table.Cell>{m.gini_index}</Table.Cell>
        <Table.Cell>{m.max_hash_rate}</Table.Cell>
        <Table.Cell>
          <Moment date={date} format="MM/DD/YYYY hh:mm:ss A" />
        </Table.Cell>
        <Table.Cell>
          <Moment date={receivedDate} format="MM/DD/YYYY hh:mm:ss A" />
        </Table.Cell>
      </Table.Row>
    )
  })

  const plots = blocks.map(block => ({ x: parseInt(block.height), y: block.nTx }))
  const plots_monitor_1 = monitoring.map(m => ({ x: m.time, y: m.gini_index }))
  const plots_monitor_2 = monitoring.map(m => ({ x: m.time, y: m.max_hash_rate }))

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
            <VictoryAxis dependentAxis />
            <VictoryAxis tickFormat={() => ''} />
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

      <Divider />

      <Header as="h2">Monitoring</Header>
      <Grid>
        <Grid.Column width={16}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={1200}
            height={300}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis tickFormat={() => ''} />
            <VictoryLine
              data={plots_monitor_1}
              animate={{ duration: 500 }}
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" }
              }}
            />
            <VictoryLine
              data={plots_monitor_2}
              animate={{ duration: 500 }}
              style={{
                data: { stroke: "blue" },
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
            <Table.HeaderCell width={3}>Gini Index</Table.HeaderCell>
            <Table.HeaderCell width={3}>Max Hash Rate</Table.HeaderCell>
            <Table.HeaderCell width={5}>Time</Table.HeaderCell>
            <Table.HeaderCell width={5}>Received At</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {monitor_rows.slice(0, MAX_ROW)}
        </Table.Body>
      </Table>
    </>
  )
}