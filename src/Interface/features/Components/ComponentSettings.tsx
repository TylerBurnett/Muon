import React from 'react';
import { Box, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { IComponentSettings } from '../../../Application/Component/IComponentSettings';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { componentSelector } from './ComponentSlice';

function ComponentSettings(props: any) {
  const component: IComponentSettings = useAppSelector(
    // eslint-disable-next-line react/destructuring-assignment
    componentSelector(props.match.params.id)
  );
  const dispatch = useAppDispatch();

  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <Grid container spacing={5}>
          <Grid item>
            <Paper style={{ height: '100px', width: '100px' }} />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h3">{component.name}</Typography>
            <Typography variant="body1">{component.uuid}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h5">Component Information</Typography>
        <Paper variant="outlined">
          <Box padding={3}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  label="Display File"
                  size="small"
                  fullWidth
                  disabled
                  value={component.displayFile}
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  label="Component File"
                  size="small"
                  fullWidth
                  disabled
                  value={component.componentPath}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item>
        <Typography variant="h5">Settings</Typography>
        <Paper elevation={0} variant="outlined">
          <Box padding={3}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  label="Display File"
                  size="small"
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  label="Component File"
                  size="small"
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  label="Another item"
                  size="small"
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ComponentSettings;
