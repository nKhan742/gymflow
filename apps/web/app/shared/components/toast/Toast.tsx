import React from 'react';
import { Box } from '@mui/material';
import { IToastProps } from './Toast.types';

export const Toast: React.FC<IToastProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
