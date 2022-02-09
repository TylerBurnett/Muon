/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IComponentSettingsMeta } from '../../../main/Data/ComponentConfig';
import ComponentAvatar from './ComponentAvatar';

interface ComponentCardProps {
  component: IComponentSettingsMeta;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const navigate = useNavigate();
  const [cardElevation, setCardElevation] = useState(1);

  return (
    <Card
      onClick={() => navigate(`/component/${component.uuid}`)}
      elevation={cardElevation}
      onMouseEnter={() => setCardElevation(4)}
      onMouseLeave={() => setCardElevation(2)}
    >
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs="auto">
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
