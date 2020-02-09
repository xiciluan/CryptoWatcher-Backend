import React, { useState, useCallback } from 'react';
import { Segment, Grid } from 'semantic-ui-react'
import Controller, { INIT_VALUES } from './Controller'
import DisplayArea from './DisplayArea'

export default function QueryBuilder() {
  const [data, setData] = useState(INIT_VALUES)

  return (
    <Segment padded>
      <Grid divided>
        <Grid.Column width={4}>
          <Controller handler={setData} />  
        </Grid.Column>
        <Grid.Column width={12}>
          <DisplayArea formData={data} />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}