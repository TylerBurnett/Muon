import React from 'react';
import { Grid, Typography } from '@mui/material';
import { ComponentConfig } from '../../../main/Data/ComponentConfig';
import { useAppSelector } from '../../app/hooks';
import { componentsSelector } from './ComponentSlice';
import ComponentCard from './ComponentCard';

const Components: React.FC = () => {
  const components: ComponentConfig[] = useAppSelector(componentsSelector);

  return (
    <>
      <Grid container direction="column">
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={component.uuid}>
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
