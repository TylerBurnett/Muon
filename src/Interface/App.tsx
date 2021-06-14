import React from 'react';
import { Grid, Box } from '@material-ui/core';

import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SideBar from './features/Components/SideBar';
import ComponentSettings from './features/Components/ComponentSettings';
import { useAppDispatch } from './app/hooks';
import { getComponentsAsync } from './features/Components/ComponentSlice';

function App() {
  const dispatch = useAppDispatch();
  dispatch(getComponentsAsync());

  return (
    <Router>
      <Grid container>
        <Grid item xs={2}>
          <SideBar />
        </Grid>
        <Grid item xs={10}>
          <Box width="auto" p={15}>
            <Switch>
              <Route
                path="/component/:id"
                // eslint-disable-next-line react/jsx-props-no-spreading
                render={(props) => <ComponentSettings {...props} />}
              />
            </Switch>
          </Box>
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;
