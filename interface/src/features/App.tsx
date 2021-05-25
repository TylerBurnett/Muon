import React, { useState } from "react";
import { Grid, Container, Box } from "@material-ui/core";

import "./App.css";
import SideBar from "./Components/SideBar";
import ComponentSettings from "./Components/ComponentSettings";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
