import React, { useCallback, useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { Accordion, Button, Dimmer, Loader, Table, Container } from 'semantic-ui-react'
import moment from 'moment'
import Moment from 'react-moment';

import {BLOCKS_BETWEEN_DATES, BLOCK_BY_HASH, BLOCK_BY_HEIGHT, TX_BY_HASH, INCOME} from '../../utils/queries'
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'

function ExpandableAccordin({type, title: root, data, onSubmit}) {
  const generateContent = (title, data, isOpen) => {
    const keys = Object.keys(data)
    const rslt = []

    keys.forEach(key => {
      if (data[key] !== null) {
        const type = typeof(data[key])
        if (type !== 'object') {
          rslt.push(
            <Accordion.Accordion
              key={key}
              defaultActiveIndex={0}
              panels={[{key, title: key + ': ' + data[key]}]}
            />
          )
        } else {
          rslt.push(
            generateContent(key, data[key], false, data)
          )
        }        
      }
    })

    if (title === 'transactions' || title === 'vin' || title === 'vout') {
      rslt.push(
        <Button
          key="load-more"
          content="Load More..."
          color="facebook"
          style={{marginTop: '1em'}}
          onClick={onSubmit}
        />
      )
    }

    return (
      <Accordion
        key={title} fluid styled
        panels={[{key: title, title, content: rslt}]}
        defaultActiveIndex={isOpen ? 0 : -1}
      />
    )
  }

  return generateContent(root, data, true, {})
}

export default function DisplayArea({formData}) {
  const prevFormData = useRef(null)
  const displayData = useRef(null)

  const [
    getBlockByHash,
    { loading: blockByHashLoading, error: err0, data: blockByHashData}
  ] = useLazyQuery(BLOCK_BY_HASH)

  const [
    getBlockByHeight,
    { loading: blockByHeightLoading, error: err1, data: blockByHeightData}
  ] = useLazyQuery(BLOCK_BY_HEIGHT)

  const [
    getBlocksBetweenDate,
    { loading: blocksLoading, error: err2, data: blocksBetweenDateData}
  ] = useLazyQuery(BLOCKS_BETWEEN_DATES)

  const [
    getTxByBlockHash,
    { error: err3, data: moreTxData }
  ] = useLazyQuery(TX_BY_HASH)

  const [
    getWalletIncome,
    { loading: walletIncomeLoading, error: err4, data: walletIncomeData }
  ] = useLazyQuery(INCOME)


  const loadMoreClicked = useCallback(() => {
    if (formData.type === 'block') {
      // it has to be a block in displayData
      getTxByBlockHash({variables: {
        hash: displayData.current.hash,
        offset: displayData.current.transactions.length,
        limit: 5
      }})
    }
  }, [formData.type, getTxByBlockHash])

  if (blockByHashLoading || blockByHeightLoading || blocksLoading || walletIncomeLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  } else if (err0 || err1 || err2 || err3 || err4) {
    return (
      "Error"
    )
  }

  if (formData !== prevFormData.current) {
    displayData.current = null
  }

  if (formData.type === 'block') {
    if (formData.b_column === 'height') {
      if (formData.b_val !== '' && formData !== prevFormData.current) {
        getBlockByHeight({variables: {height: parseInt(formData.b_val)}})
        prevFormData.current = formData
      }
      if (blockByHeightData) {
        displayData.current = blockByHeightData.getBlockByHeight
      }
      if (moreTxData && displayData.current) {
        const newArr = [...displayData.current.transactions, ...moreTxData.getTxByBlockHash]
        displayData.current.transactions = newArr
      }
    } else if (formData.b_column === 'hash') { 
      if (formData.b_val !== '' && formData !== prevFormData.current) {
        getBlockByHash({variables: {hash: formData.b_val}})
        prevFormData.current = formData
      }
      if (blockByHashData) {
        displayData.current = blockByHashData.getBlockByHash
      }
      if (moreTxData && displayData.current) {
        const newArr = [...displayData.current.transactions, ...moreTxData.getTxByBlockHash]
        displayData.current.transactions = newArr
      }
    } else if (formData.b_column === 'time') {
      if (formData.b_from !== '' && formData !== prevFormData.current) {
        getBlocksBetweenDate({
          variables: {
            from: moment(formData.b_from).unix(),
            to: moment(formData.b_to).unix(),
            offset: 0,
            limit: 20,
          }
        })
        prevFormData.current = formData
      }
      if (blocksBetweenDateData) {
        displayData.current = blocksBetweenDateData.getBlocksBetweenDate
      }
    }
  } else if (formData.type === 'wallet') {
    if (formData.w_val !== '' && formData !== prevFormData.current) {
      getWalletIncome({variables: {addr: formData.w_val}})
      prevFormData.current = formData
    }
    if (walletIncomeData) {
      displayData.current = walletIncomeData.getWalletIncome
    }
  }

  if (!displayData.current) {
    return null
  }

  if ((formData.type === 'block' && formData.b_column === 'time') || formData.type === 'wallet') {
    let plots;
    let rows;
    if (formData.type === 'block') {
      plots = displayData.current.map(b => ({x: moment.unix(b.time).toISOString(), y: b.nTx}))
      rows = displayData.current.map(b => {
        const l = b.hash.length
        const blockDate = moment.unix(b.time)
        return (
          <Table.Row key={b.hash}>
            <Table.Cell>...{b.hash.substring(l - 10)}</Table.Cell>
            <Table.Cell>{b.height}</Table.Cell>
            <Table.Cell>{b.nTx}</Table.Cell>
            <Table.Cell>{b.miner}</Table.Cell>
            <Table.Cell>
              <Moment date={blockDate} format="MM/DD/YYYY hh:mm:ss A" />
            </Table.Cell>
          </Table.Row>
        )
      })
    } else {
      plots = displayData.current.map(v => ({x: moment.unix(v.time).toISOString(), y: v.val}))
      rows = displayData.current.map(v => {
        const date = moment.unix(v.time)
        return (
          <Table.Row key={v.time}>            
            <Table.Cell>
              <Moment date={date} format="MM/DD/YYYY hh:mm:ss A" />
            </Table.Cell>
            <Table.Cell>{v.val}</Table.Cell>
          </Table.Row>
        )
      })
    }
    return (
      <>
        <Container>
        <VictoryChart
          theme={VictoryTheme.material}
          width={1000}
          height={500}
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
        </Container>
        <Container>
        <Table fixed singleLine={false}>
          <Table.Header>
            <Table.Row key="header_row">
              {
                formData.type === 'block' ? (
                  <>
                    <Table.HeaderCell width={3}>Hash</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Height</Table.HeaderCell>
                    <Table.HeaderCell width={2}>#Tx</Table.HeaderCell>
                    <Table.HeaderCell width={5}>Miner</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Block Time</Table.HeaderCell>
                  </>
                ) : (
                  <>
                    <Table.HeaderCell width={8}>Date</Table.HeaderCell>
                    <Table.HeaderCell width={8}>Value</Table.HeaderCell>
                  </>
                )
              }
              
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
        </Container>
      </>
    )
  }

  return (
    <ExpandableAccordin
      type={formData.type}
      title={formData.type}
      data={displayData.current}
      onSubmit={loadMoreClicked}
    />
  )
}
