import React from 'react';
import { Box, Typography } from '@mui/material';
import { INoDataProps } from './NoData.types';

export const NoData: React.FC<INoDataProps> = ({
  title = 'NoData',
  message = 'No records or data available at this time.',
  action,
}) => {
  return (
    <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
      <Typography variant="h6" fontWeight={600}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>{message}</Typography>
      {action}
    </Box>
  );
};
