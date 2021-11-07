/* eslint-disable react/prop-types */
import React from 'react';
import {
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IComponentSettingsMeta } from '../../../Application/Component/IComponentSettings';
import ComponentAvatar from './ComponentAvatar';

interface ComponentCardProps {
  component: IComponentSettingsMeta;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/component/${component.uuid}`)}>
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <Grid container>
              <Grid item xs={3}>
                <ComponentAvatar component={component} />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h5">{component.name}</Typography>
                <Typography variant="subtitle2">
                  {component.authorName}
                </Typography>
                <Typography variant="body1">{component.description}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ComponentCard;
