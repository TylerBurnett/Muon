import { Box, Grid, Paper, TextField, Typography } from "@material-ui/core";

function ComponentSettings() {
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container spacing={5}>
          <Grid item>
            <Paper style={{ height: "100px", width: "100px" }} />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h3">Component Name</Typography>
            <Typography variant="body1">
              Description which is decently long in length. lorem ipsium dollor
              semet
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h5">Component Information</Typography>
        <Paper variant="outlined">
          <Box padding={3}>
            <TextField
              label="Display File"
              variant="outlined"
              size="small"
              disabled
            />
            <TextField
              label="Component File"
              variant="outlined"
              size="small"
              disabled
            />

            <TextField
              label="Component File"
              variant="outlined"
              size="small"
              disabled
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item>
        <Typography variant="h5">Settings</Typography>
        <Paper elevation={0} variant="outlined"></Paper>
      </Grid>
    </Grid>
  );
}

export default ComponentSettings;
