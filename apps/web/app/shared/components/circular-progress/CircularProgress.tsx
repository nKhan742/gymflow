import React from 'react';
import { Box } from '@mui/material';
import { ICircularProgressProps } from './CircularProgress.types';

export const CircularProgress: React.FC<ICircularProgressProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
