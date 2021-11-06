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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  ComponentSettingsValidator,
  IComponentSettingsMeta,
} from '../../../Application/Component/IComponentSettings';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  componentSelector,
  componentsSelector,
  saveComponentAsync,
} from './ComponentSlice';
import ComponentCard from './ComponentCard';

const Components: React.FC = () => {
  const components: IComponentSettingsMeta[] =
    useAppSelector(componentsSelector);

  const dispatch = useAppDispatch();
  const validationSchema = ComponentSettingsValidator;

  return (
    <>
      <Grid container direction="column" spacing={5}>
        <Grid item>
          <Grid container spacing={5}>
            <Grid item xs={5}>
              <Typography variant="h3">Components</Typography>
              <Typography variant="subtitle2">
                All of your desktop customizability goodness in one place.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            {components.map((component) => (
              <Grid item xs={4} key={component.uuid}>
                <ComponentCard component={component} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Components;
