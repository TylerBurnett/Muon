import React, { useState } from "react";
import { Grid, Container, Box } from "@material-ui/core";

import "./App.css";
import SideBar from "./SideBar";
import ComponentSettings from "./ComponentSettings";

function App() {
  return (
    <Grid container>
      <Grid item xs={2}>
        <SideBar />
      </Grid>
      <Grid item xs={10}>
        <Box width="auto" p={15}>
          <ComponentSettings />
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
