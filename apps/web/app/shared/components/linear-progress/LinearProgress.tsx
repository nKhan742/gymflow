import React from 'react';
import { Box } from '@mui/material';
import { ILinearProgressProps } from './LinearProgress.types';

export const LinearProgress: React.FC<ILinearProgressProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
