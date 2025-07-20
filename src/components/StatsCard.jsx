// src/components/StatsCard.jsx
import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            {icon}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatsCard;