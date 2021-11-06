import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import { useFormik } from 'formik';
import { Save as SaveIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ApplicationSettingsValidator,
  IApplicationSettings,
} from '../../../Application/ComponentManager/IApplicationSettings';
import { saveSettingsAsync, settingsSelector } from './SettingsSlice';

function ApplicationSettings(props: any) {
  const settings: IApplicationSettings = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();

  const validationSchema = ApplicationSettingsValidator;

  const formik = useFormik({
    initialValues: settings,
    validationSchema,
    onSubmit: (values: IApplicationSettings) => {
      // eslint-disable-next-line no-alert
      dispatch(saveSettingsAsync(values));
    },
  });

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container>
          <Grid item xs={5}>
            <Typography variant="h3">Components</Typography>
            <Typography variant="subtitle2">
              All of your desktop customizability goodness in one place.
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Paper variant="outlined" style={{ background: 'none' }}>
          <Box>
            <Grid item>
              <Tooltip title="Save Component Settings">
                <IconButton
                  aria-label="Save Settings"
                  type="submit"
                  disabled={
                    Object.values(formik.touched).filter((v) => v).length === 0
                  }
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Box>
        </Paper>
      </Grid>

      <form onSubmit={formik.handleSubmit}>
        <Grid item style={{ marginTop: '30px' }}>
          <Typography variant="h5">Settings</Typography>
          <Divider />
          <Box padding={3}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  id="displayFile"
                  name="displayFile"
                  label="Display File"
                  value={formik.values.componentsFolderPath}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.componentsFolderPath &&
                    Boolean(formik.errors.componentsFolderPath)
                  }
                  helperText={
                    formik.touched.componentsFolderPath &&
                    formik.errors.componentsFolderPath
                  }
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </form>
    </Grid>
  );
}

export default ApplicationSettings;
