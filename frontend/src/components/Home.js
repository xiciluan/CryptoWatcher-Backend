import React from 'react';
import { Header, Image, Container, Segment, List, Icon } from 'semantic-ui-react';

export default function Home() {
  return (
    <>
      <Container fluid style={{ display: 'flex', justifyContent: 'center' }}>
        <Image src='./logo_transparent.png' size='large' />
      </Container>
      <Segment style={{ padding: '2em 0em 4em 0em' }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: '2em' }}>Live Blockchain Data Monitoring</Header>
          <p style={{ fontSize: '1.33em' }}>
              We monitor incoming blocks and calculate the decentralization indexes of the most recent time windows.
          </p>
          <Header as="h3" style={{ fontSize: '2em', paddingTop: '2em' }}>Query Builder For Historical Data</Header>
          <p style={{ fontSize: '1.33em' }}>
              We offer a query builder for you to play around. Block metadata, wallet income, displaying as list or time series chart, you name it.
          </p>
        </Container>
      </Segment>
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: '2em' }}>Tech Stack</Header>
          <Header as="h4" style={{ fontSize: '1em', paddingTop: '2em' }}>Data Pipeline</Header>
          <Image src='./pipeline.png' />
          <Header as="h4" style={{ fontSize: '1em' }}>Backend</Header>
          <List size="medium" style={{ paddingTop: '2em' }} relaxed>
            <List.Item>
              <Image size="tiny" src='./nodejs.png'/>
              <List.Content verticalAlign='middle'>
                <List.Header>Node.js</List.Header>
                <List.Description>
                  For hosting Apollo GraphQL and WebSocket servers, with Love
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Image size="tiny" src='./apollo.png'/>
              <List.Content verticalAlign='middle'>
                <List.Header>Apollo GraphQL Server</List.Header>
                <List.Description>
                  Apollo Implementation of GraphQL, real rocket science
                </List.Description>
              </List.Content>
            </List.Item>
          </List>

          <Header as="h4" style={{ marginTop: '4em', fontSize: '1em' }}>Frontend</Header>
          <List size="medium" style={{ paddingTop: '2em' }} relaxed>
            <List.Item>
              <Image size="mini" src='./graphql.png'/>
              <List.Content verticalAlign='middle'>
                <List.Header>GraphQL</List.Header>
                <List.Description>
                  It's cooler than REST, isn't it?
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Image size="mini" src='./websocket.png'/>
              <List.Content verticalAlign='middle'>
                <List.Header>WebSocket</List.Header>
                <List.Description>
                  Let it Live!
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Image size="mini" src='./react.png'/>
              <List.Content verticalAlign='middle'>
                <List.Header>React</List.Header>
                <List.Description>
                  One of the most beloved frontend frameworks
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Container>
      </Segment>
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Container text>
          <p>Crafted By: Xici Luan</p>
          <p><Icon name='mail' /><a href="mailto:xiciluan@gmail.com">xiciluan@gmail.com</a></p>
          <p><Icon name='github' /><a target="_blank" rel="noopener noreferrer" href="https://github.com/xiciluan">Github</a></p>
          <p><Icon name='linkedin' /><a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/xiciluan">LinkedIn</a></p>
        </Container>
      </Segment>
    </>
  )
}