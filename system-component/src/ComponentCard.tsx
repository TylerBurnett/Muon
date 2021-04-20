import React from "react";
import { Grid, Container, Typography, Paper } from "@material-ui/core";
import "./App.css";

function App() {
  return (
    <Paper>
      <Grid container>
        <Grid item>
          <Grid container>
            <Grid item></Grid>
            <Grid item>
              <Typography variant="h4">Card Title</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            This is a card title and i need more to talk about
            yeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default App;
