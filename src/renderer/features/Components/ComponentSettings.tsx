import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Snackbar,
  Alert,
  AlertColor,
  Chip,
  Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import SlideShowIcon from '@mui/icons-material/Slideshow';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { useParams } from 'react-router-dom';
import {
  ComponentSettingsValidator,
  IComponentSettingsMeta,
} from '../../../main/Data/ComponentConfig';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { componentSelector, saveComponentAsync } from './ComponentSlice';
import NodeAccessConfirmationDialogue from './NodeAccessConfirmation';
import {
  componentInstanceSettingsSelector,
  setComponentActiveStateAsync,
  setComponentNodeAccessAsync,
} from '../Settings/SettingsSlice';

const ComponentSettings: React.FC = () => {
  const { uuid } = useParams();

  const component: IComponentSettingsMeta = useAppSelector(
    componentSelector(uuid || '')
  );
  const componentInstanceSettings = useAppSelector(
    componentInstanceSettingsSelector(uuid || '')
  );

  const dispatch = useAppDispatch();
  const validationSchema = ComponentSettingsValidator;

  const [nodeDialogueState, setNodeDialogueState] = useState(false);

  const [toastState, setToastState] = useState({
    active: false,
    type: 'warning' as AlertColor,
    message: '',
  });

  const formik = useFormik({
    initialValues: component,
    validationSchema,
    onSubmit: (values: IComponentSettingsMeta) => {
      dispatch(saveComponentAsync(values));

      setToastState({
        active: true,
        type: 'info',
        message: 'Component Settings Saved.',
      });
    },
  });

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Grid container spacing={5}>
            <Grid item>
              <Avatar
                alt="Component Icon"
                src={component.iconData}
                sx={{ width: 90, height: 90 }}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h3">{component.name}</Typography>
              <Typography variant="body1">{component.authorName}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <form onSubmit={formik.handleSubmit}>
          <Grid item>
            <Paper variant="outlined" style={{ background: 'none' }}>
              <Box>
                <Grid container>
                  <Grid item>
                    <Tooltip title="Save Component Settings">
                      <IconButton aria-label="Save Settings" type="submit">
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item>
                    <Divider orientation="vertical" />
                  </Grid>

                  <Grid item>
                    <Tooltip
                      title={
                        componentInstanceSettings.active
                          ? 'Stop Component'
                          : 'Start Component'
                      }
                    >
                      <IconButton
                        color={
                          componentInstanceSettings.active
                            ? 'secondary'
                            : 'primary'
                        }
                        onClick={() =>
                          dispatch(
                            setComponentActiveStateAsync({
                              uuid: componentInstanceSettings.uuid,
                              newState: !componentInstanceSettings.active,
                            })
                          )
                        }
                      >
                        {componentInstanceSettings.active ? (
                          <CancelPresentationIcon />
                        ) : (
                          <SlideShowIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item>
                    <Tooltip
                      title={
                        componentInstanceSettings.nodeAccess
                          ? 'Revoke Node Access'
                          : 'Give Node Access'
                      }
                    >
                      <IconButton
                        color={
                          componentInstanceSettings.nodeAccess
                            ? 'secondary'
                            : 'primary'
                        }
                        onClick={() => setNodeDialogueState(true)}
                      >
                        {componentInstanceSettings.nodeAccess ? (
                          <CodeOffIcon />
                        ) : (
                          <CodeIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item>
                    <Tooltip title="Restart Component">
                      <IconButton
                        aria-label="Save Settings"
                        type="submit"
                        disabled
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item style={{ marginTop: '30px' }}>
            <Typography variant="h5">Component Information</Typography>
            <Divider />
            <Box padding={3}>
              <Typography variant="body1" paragraph>
                {component.description}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip
                  variant="outlined"
                  color={component.production ? 'success' : 'warning'}
                  label={`Version: ${
                    component.production ? 'Production' : 'Development'
                  }`}
                />
                <Chip
                  variant="outlined"
                  color={
                    componentInstanceSettings.nodeAccess ? 'warning' : 'success'
                  }
                  label={`Node Requirement: ${
                    componentInstanceSettings.nodeAccess ? 'Yes' : 'No'
                  }`}
                />
              </Stack>
            </Box>
          </Grid>

          <Grid item style={{ marginTop: '20px' }}>
            <Typography variant="h5">Settings</Typography>
            <Divider />
            <Box padding={3}>
              <Grid container spacing={3}>
                {component.settings.map((setting, index) => (
                  <Grid item xs={5} key={`ComponentSetting-${setting.name}`}>
                    <TextField
                      id={`settings.[${index}].value`}
                      name={`settings.[${index}].value`}
                      label={setting.name}
                      placeholder={setting.description}
                      value={formik.values.settings[index].value}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.settings?.[index].value}
                      helperText={formik.touched.settings?.[index].value}
                      size="small"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </form>
      </Grid>
      <Snackbar
        open={toastState.active}
        autoHideDuration={2000}
        onClose={() =>
          setToastState({ active: false, type: 'info', message: '' })
        }
      >
        <Alert severity={toastState.type} sx={{ width: '100%' }}>
          {toastState.message}
        </Alert>
      </Snackbar>

      <NodeAccessConfirmationDialogue
        open={nodeDialogueState}
        onClose={(result: boolean) => {
          setNodeDialogueState(false);

          if (result) {
            dispatch(
              setComponentNodeAccessAsync({
                uuid: componentInstanceSettings.uuid,
                newState: !componentInstanceSettings.nodeAccess,
              })
            );
          }
        }}
      />
    </>
  );
};

export default ComponentSettings;
