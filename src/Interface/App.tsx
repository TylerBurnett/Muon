import React from 'react';
import { Grid, Box } from '@material-ui/core';

import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SideBar from './features/Components/SideBar';
import ComponentSettings from './features/Components/ComponentSettings';

function App() {
  return (
    <Grid container>
      <Grid item xs={2}>
        <SideBar />
      </Grid>
      <Grid item xs={10}>
        <Box width="auto" p={15}>
          <Router>
            <Switch>
              <Route path="/component/:id">
                <ComponentSettings />
              </Route>
            </Switch>
          </Router>
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
