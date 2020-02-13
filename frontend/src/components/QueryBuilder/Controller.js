import React, { useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { Form, Dimmer, Loader } from 'semantic-ui-react'
import { useFormik } from 'formik';
import DateTime from 'react-datetime';
import moment from 'moment'

import './react-datetime.css'
import {LATEST_BLOCK_TIME} from '../../utils/queries'

const TYPES = ['block', 'wallet']
export const INIT_VALUES = {
  type: 'block',
  b_column: 'height',
  b_val: '',
  b_from: null,
  b_to: null,
  t_column: 'hash',
  t_val: '',
  w_column: 'address',
  w_val: ''
} 

function WalletControllerFragment({formik}) {
  const options = ['address'].map(o => ({
    key: o,
    text: o,
    value: o
  }))
  
  return (
    <>
      <Form.Field>
        <label>Column</label>
        <Form.Dropdown 
          fluid
          selection
          name="w_column"
          options={options}          
          value={formik.values.w_column}
          onChange={(_, {name, value}) => {
            formik.setFieldValue(name, value)
          }}
        />        
      </Form.Field>
      <Form.Field>
        <label>Value</label>
        <Form.Input
          name="w_val"
          placeholder="1NkuHZhCQAdNbTqkTv3GvXrdqx6C4J3geh"
          value={formik.values.w_val}
          onChange={formik.handleChange}
        />
      </Form.Field>
    </>
  );
}

// function TxControllerFragment({formik}) {
//   const options = ['tx_id', 'hash'].map(o => ({
//     key: o,
//     text: o,
//     value: o
//   }))
  
//   return (
//     <>
//       <Form.Field>
//         <label>Column</label>
//         <Form.Dropdown 
//           fluid
//           selection
//           name="t_column"
//           options={options}          
//           value={formik.values.t_column}
//           onChange={(_, {name, value}) => {
//             formik.setFieldValue(name, value)
//           }}
//         />        
//       </Form.Field>
//       <Form.Field>
//         <label>Value</label>
//         <Form.Input
//           name="t_val"
//           placeholder={
//             formik.values.b_column === 'tx_id'
//               ? "00101af76190ff12b70450b02000540d819fb2ab40f5dfa33d2afb050f78499e"
//               : "000000000000000000262cb4bfb200dc16327f4341dec2c319ae7f17773f2564"
//           }
//           value={formik.values.t_val}
//           onChange={formik.handleChange}
//         />
//       </Form.Field>
//     </>
//   );
// }

function BlockControllerFragment({formik}) {
  const options = ['height', 'hash', 'time'].map(o => ({
    key: o,
    text: o,
    value: o
  }))
  const [
    getLatestBlockTime,
    { loading: blockLoading, data: blockData}
  ] = useLazyQuery(LATEST_BLOCK_TIME)

  if (!blockLoading && blockData !== undefined && formik.values.b_to === null) {
    formik.values.b_to = moment.unix(blockData.latestBlocks[0].time)
    formik.values.b_from = moment(formik.values.b_to).subtract(1, 'hours')
  }
  
  return (
    <>
      <Form.Field>
        <label>Column</label>
        <Form.Dropdown 
          fluid
          selection
          name="b_column"
          options={options}          
          value={formik.values.b_column}
          onChange={(_, {name, value}) => {
            if (value === 'time') {
              getLatestBlockTime({variables: { total: 1 }})
            }
            formik.setFieldValue(name, value)
          }}
        />        
      </Form.Field>
      {
        formik.values.b_column === 'time' ? (
          blockLoading ? (
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          ) : (
            <>
              <Form.Field>
                <label>From</label>
                <DateTime value={formik.values.b_from} onChange={value => formik.setFieldValue('b_from', value)} />
              </Form.Field>
              <Form.Field>
                <label>To</label>
                <DateTime value={formik.values.b_to} onChange={value => formik.setFieldValue('b_to', value)} />
              </Form.Field>
            </>
          )
        ) : (
          <Form.Field>
            <label>Value</label>
            <Form.Input
              name="b_val"
              placeholder={
                formik.values.b_column === 'height' ? 531234
                  : "000000000000000000262cb4bfb200dc16327f4341dec2c319ae7f17773f2564"
              }
              value={formik.values.b_val}
              onChange={formik.handleChange}
            />
          </Form.Field>
        )
      }
    </>
  );
}

export default function Controller({handler}) {
  const formik = useFormik({
    initialValues: {...INIT_VALUES},
    onSubmit: handler
  })

  const options = TYPES.map(t => ({
    key: t,
    text: t,
    value: t
  }))

  const handleChange = useCallback((_, {name, value}) => {
    formik.setFieldValue(name, value)
  }, [formik])

  const renderSwtich = (formik) => {
    switch(formik.values.type) {
      case 'block': return <BlockControllerFragment formik={formik} />
      // case 'transactions': return <TxControllerFragment formik={formik} />
      case 'wallet': return <WalletControllerFragment formik={formik} />
      default: return null
    }
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Field>
        <label>Type</label>
        <Form.Dropdown
          fluid
          selection
          options={options}
          value={formik.values.type}
          name="type"
          onChange={handleChange}
        />
      </Form.Field>
      {renderSwtich(formik)}
      <Form.Button content="Submit" type="submit" />
    </Form>        
  )
}
