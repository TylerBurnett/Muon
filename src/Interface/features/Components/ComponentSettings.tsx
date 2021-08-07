import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Divider,
} from '@material-ui/core';
import { useFormik } from 'formik';
import {
  Slideshow as SlideShowIcon,
  CancelPresentation as CancelPresentationIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';
import {
  ComponentSettingsValidator,
  IComponentSettingsMeta,
} from '../../../Application/Component/IComponentSettings';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { componentSelector, saveComponentAsync } from './ComponentSlice';

function ComponentSettings(props: any) {
  const component: IComponentSettingsMeta = useAppSelector(
    // eslint-disable-next-line react/destructuring-assignment
    componentSelector(props.match.params.id)
  );
  const dispatch = useAppDispatch();

  const validationSchema = ComponentSettingsValidator;

  const formik = useFormik({
    initialValues: component,
    validationSchema,
    onSubmit: (values: IComponentSettingsMeta) => {
      // eslint-disable-next-line no-alert
      dispatch(saveComponentAsync(values));
    },
  });

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
      <form onSubmit={formik.handleSubmit}>
        <Grid item>
          <Paper variant="outlined" style={{ background: 'none' }}>
            <Box>
              <Grid container>
                <Grid item>
                  {component.active && (
                    <IconButton
                      color="secondary"
                      aria-label="Stop component"
                      onClick={() =>
                        dispatch(
                          saveComponentAsync({ ...component, active: false })
                        )
                      }
                    >
                      <CancelPresentationIcon />
                    </IconButton>
                  )}
                  {!component.active && (
                    <IconButton
                      color="primary"
                      aria-label="Start Component"
                      onClick={() =>
                        dispatch(
                          saveComponentAsync({ ...component, active: true })
                        )
                      }
                    >
                      <SlideShowIcon />
                    </IconButton>
                  )}
                </Grid>

                <Grid item>
                  <IconButton aria-label="Save Settings" type="submit" disabled>
                    <RefreshIcon />
                  </IconButton>
                </Grid>

                <Grid item>
                  <Divider orientation="vertical" />
                </Grid>

                <Grid item>
                  <IconButton
                    aria-label="Save Settings"
                    type="submit"
                    disabled={
                      Object.values(formik.touched).filter((v) => v).length ===
                      0
                    }
                  >
                    <SaveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item style={{ marginTop: '30px' }}>
          <Typography variant="h5">Component Information</Typography>
          <Divider />
          <Box padding={3}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  id="displayFile"
                  name="displayFile"
                  label="Display File"
                  value={formik.values.displayFile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.displayFile &&
                    Boolean(formik.errors.displayFile)
                  }
                  helperText={
                    formik.touched.displayFile && formik.errors.displayFile
                  }
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  id="ComponentPath"
                  name="ComponentPath"
                  label="Component Path"
                  value={component.componentPath}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.displayFile &&
                    Boolean(formik.errors.displayFile)
                  }
                  helperText={
                    formik.touched.displayFile && formik.errors.displayFile
                  }
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item style={{ marginTop: '20px' }}>
          <Typography variant="h5">Settings</Typography>
          <Divider />
          <Box padding={3}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  id="componentPath"
                  name="componentPath"
                  label="Component Path"
                  value={formik.values.componentPath}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.componentPath &&
                    Boolean(formik.errors.componentPath)
                  }
                  helperText={
                    formik.touched.componentPath && formik.errors.componentPath
                  }
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  id="configPath"
                  name="configPath"
                  label="Config Path"
                  value={formik.values.configPath}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.configPath &&
                    Boolean(formik.errors.configPath)
                  }
                  helperText={
                    formik.touched.configPath && formik.errors.configPath
                  }
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  label="Another item"
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

export default ComponentSettings;
