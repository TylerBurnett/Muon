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
  ComponentConfig,
} from '../../../main/Data/ComponentConfig';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { componentSelector, saveComponentAsync } from './ComponentSlice';
import NodeAccessConfirmationDialogue from './NodeAccessConfirmation';
import {
  componentSettingsSelector,
  setComponentSettingsAsync,
} from '../Settings/SettingsSlice';
import ComponentAvatar from './ComponentAvatar';

const ComponentSettings: React.FC = () => {
  const { uuid } = useParams();

  const component: ComponentConfig = useAppSelector(
    componentSelector(uuid || '')
  );
  const componentSettings = useAppSelector(
    componentSettingsSelector(uuid || '')
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
    onSubmit: (values: ComponentConfig) => {
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
              <ComponentAvatar component={component} size="90px" />
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
                        componentSettings.active
                          ? 'Stop Component'
                          : 'Start Component'
                      }
                    >
                      <IconButton
                        color={
                          componentSettings.active ? 'secondary' : 'primary'
                        }
                        onClick={() =>
                          dispatch(
                            setComponentSettingsAsync({
                              ...componentSettings,
                              active: !componentSettings.active,
                            })
                          )
                        }
                      >
                        {componentSettings.active ? (
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
                        componentSettings.nodeAccess
                          ? 'Revoke Node Access'
                          : 'Give Node Access'
                      }
                    >
                      <IconButton
                        color={
                          componentSettings.nodeAccess ? 'secondary' : 'primary'
                        }
                        onClick={() => setNodeDialogueState(true)}
                        disabled={!component.nodeDependency}
                      >
                        {componentSettings.nodeAccess ? (
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
              <Typography variant="body1" paragraph style={{ height: '100px' }}>
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
                  color={componentSettings.nodeAccess ? 'warning' : 'success'}
                  label={`Node Requirement: ${
                    componentSettings.nodeAccess ? 'Yes' : 'No'
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
              setComponentSettingsAsync({
                ...componentSettings,
                nodeAccess: !componentSettings.nodeAccess,
              })
            );
          }
        }}
      />
    </>
  );
};

export default ComponentSettings;
