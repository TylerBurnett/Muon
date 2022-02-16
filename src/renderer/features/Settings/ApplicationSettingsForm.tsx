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
  ApplicationSettings,
  ApplicationSettingsValidator,
} from '../../../main/Data/ApplicationSettings';
import {
  saveApplicationSettingsAsync,
  applicationSettingsSelector,
} from './SettingsSlice';

const ApplicationSettingsForm: React.FC = () => {
  const settings: ApplicationSettings = useAppSelector(
    applicationSettingsSelector
  );
  const dispatch = useAppDispatch();

  const validationSchema = ApplicationSettingsValidator;

  const formik = useFormik({
    initialValues: settings,
    validationSchema,
    onSubmit: (values: ApplicationSettings) => {
      dispatch(saveApplicationSettingsAsync(values));
    },
  });

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container>
          <Grid item xs={5}>
            <Typography variant="h3">Settings</Typography>
            <Typography variant="subtitle2">
              Tweak your interface settings till your heart is content
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
                  id="componentsFolderPath"
                  name="componentsFolderPath"
                  label="Components Directory"
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
};

export default ApplicationSettingsForm;
