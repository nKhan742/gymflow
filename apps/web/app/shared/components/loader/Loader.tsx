import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ILoaderProps } from './Loader.types';

export const Loader: React.FC<ILoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, minHeight: 200 }}>
      <CircularProgress />
      {message && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};
