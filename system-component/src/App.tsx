import React from "react";
import { Grid, Container, Typography, Paper } from "@material-ui/core";
import "./App.css";

function App() {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Paper>
          <Container>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h3">Title 1</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3">Title 2</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3">Title 3</Typography>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default App;
