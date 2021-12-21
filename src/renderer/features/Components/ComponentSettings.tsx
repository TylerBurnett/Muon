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
} from '../../../main/Component/IComponentSettings';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { componentSelector, saveComponentAsync } from './ComponentSlice';
import NodeAccessConfirmationDialogue from './NodeAccessConfirmation';
import {
  componentNodeAccessSelector,
  saveSettingsAsync,
  settingsSelector,
} from '../Settings/SettingsSlice';
import { IApplicationSettings } from '../../../main/ComponentManager/IApplicationSettings';

const ComponentSettings: React.FC = () => {
  const { uuid } = useParams();

  const component: IComponentSettingsMeta = useAppSelector(
    componentSelector(uuid || '')
  );
  const settings: IApplicationSettings = useAppSelector(settingsSelector);
  const componentNodeAccess: boolean = useAppSelector(
    componentNodeAccessSelector(component.uuid)
  );

  const dispatch = useAppDispatch();
  const validationSchema = ComponentSettingsValidator;

  const formik = useFormik({
    initialValues: component,
    validationSchema,
    onSubmit: (values: IComponentSettingsMeta) => {
      dispatch(saveComponentAsync(values));
    },
  });

  const [nodeDialogueState, setNodeDialogueState] = useState(false);

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Grid container spacing={5}>
            <Grid item>
              <Avatar
                alt="Remy Sharp"
                src={component.iconData}
                sx={{ width: 90, height: 90 }}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h3">{component.name}</Typography>
              <Typography variant="body1">{component.uuid}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Paper variant="outlined" style={{ background: 'none' }}>
            <Box>
              <Grid container>
                <Grid item>
                  <Tooltip
                    title={
                      component.active ? 'Stop Component' : 'Start Component'
                    }
                  >
                    <IconButton
                      color={component.active ? 'secondary' : 'primary'}
                      onClick={() =>
                        dispatch(
                          saveComponentAsync({
                            ...component,
                            active: !component.active,
                          })
                        )
                      }
                    >
                      {component.active ? (
                        <CancelPresentationIcon />
                      ) : (
                        <SlideShowIcon />
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

                <Grid item>
                  <Tooltip
                    title={
                      componentNodeAccess
                        ? 'Revoke Node Access'
                        : 'Give Node Access'
                    }
                  >
                    <IconButton
                      color={componentNodeAccess ? 'secondary' : 'primary'}
                      onClick={() => setNodeDialogueState(true)}
                    >
                      {componentNodeAccess ? <CodeOffIcon /> : <CodeIcon />}
                    </IconButton>
                  </Tooltip>
                </Grid>

                <Grid item>
                  <Divider orientation="vertical" />
                </Grid>

                <Grid item>
                  <Tooltip title="Save Component Settings">
                    <IconButton
                      aria-label="Save Settings"
                      type="submit"
                      disabled={
                        Object.values(formik.touched).filter((v) => v)
                          .length === 0
                      }
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <form onSubmit={formik.handleSubmit}>
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
                      formik.touched.componentPath &&
                      formik.errors.componentPath
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
              </Grid>
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
                      error={
                        formik.touched.settings?.[index].value // &&
                        // Boolean(formik.errors.settings?.[index].value)
                      }
                      helperText={
                        formik.touched.settings?.[index].value // &&
                        // formik.errors.settings?.[index].value
                      }
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
      <NodeAccessConfirmationDialogue
        open={nodeDialogueState}
        onClose={(result: boolean) => {
          setNodeDialogueState(false);

          if (result) {
            if (componentNodeAccess)
              dispatch(
                saveSettingsAsync({
                  ...settings,
                  componentNodeAccessWhitelist:
                    settings.componentNodeAccessWhitelist.filter(
                      (whiteListuuid) => whiteListuuid !== uuid
                    ),
                })
              );
            else
              dispatch(
                saveSettingsAsync({
                  ...settings,
                  componentNodeAccessWhitelist: [
                    ...settings.componentNodeAccessWhitelist,
                    uuid || '',
                  ],
                })
              );
          }
        }}
      />
    </>
  );
};

export default ComponentSettings;
