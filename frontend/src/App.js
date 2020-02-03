import React from 'react';

import { Container } from 'semantic-ui-react'
import TopBar from "./components/TopBar"
import Home from './components/Home'
import Charts from './components/Charts'
import About from './components/About'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Container>
      <Router>
        <TopBar />
        <Container style={{ marginTop: '4em' }}>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/charts">
              <Charts />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
          </Switch>
        </Container>
      </Router >
    </Container >
  );
}

export default App;
