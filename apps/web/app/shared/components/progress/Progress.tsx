import React from 'react';
import { Box } from '@mui/material';
import { IProgressProps } from './Progress.types';

export const Progress: React.FC<IProgressProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
