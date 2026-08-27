import React from 'react';
import { Box } from '@mui/material';
import { IAlertProps } from './Alert.types';

export const Alert: React.FC<IAlertProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
