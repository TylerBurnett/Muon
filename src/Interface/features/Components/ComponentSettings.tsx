import React from 'react';
import * as yup from 'yup';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { IComponentSettingsMeta } from '../../../Application/Common/IComponentSettings';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { componentSelector, saveComponentAsync } from './ComponentSlice';

function ComponentSettings(props: any) {
  const component: IComponentSettingsMeta = useAppSelector(
    // eslint-disable-next-line react/destructuring-assignment
    componentSelector(props.match.params.id)
  );
  const dispatch = useAppDispatch();

  const validationSchema = yup.object({
    displayFile: yup.string().required('Display File Requires a value'),
  });

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
          <Typography variant="h5">Component Information</Typography>
          <Paper variant="outlined">
            <Box padding={3}>
              <Grid container spacing={3}>
                <Grid item xs={5}>
                  <TextField
                    id="displayFile"
                    name="displayFile"
                    label="Display File"
                    value={formik.values.displayFile}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.displayFile &&
                      Boolean(formik.errors.displayFile)
                    }
                    helperText={
                      formik.touched.displayFile && formik.errors.displayFile
                    }
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
                    error={
                      formik.touched.displayFile &&
                      Boolean(formik.errors.displayFile)
                    }
                    helperText={
                      formik.touched.displayFile && formik.errors.displayFile
                    }
                    fullWidth
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
                    id="componentPath"
                    name="componentPath"
                    label="Component Path"
                    value={formik.values.componentPath}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.componentPath &&
                      Boolean(formik.errors.componentPath)
                    }
                    helperText={
                      formik.touched.componentPath &&
                      formik.errors.componentPath
                    }
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
                    error={
                      formik.touched.configPath &&
                      Boolean(formik.errors.configPath)
                    }
                    helperText={
                      formik.touched.configPath && formik.errors.configPath
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField label="Another item" size="small" fullWidth />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Button color="primary" variant="contained" fullWidth type="submit">
          IsValidating: {formik.isValidating}, IsSubmitting:
          {formik.isSubmitting}
        </Button>
      </form>
    </Grid>
  );
}

export default ComponentSettings;
