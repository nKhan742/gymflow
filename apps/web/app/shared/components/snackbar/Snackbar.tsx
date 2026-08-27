import React from 'react';
import { Box } from '@mui/material';
import { ISnackbarProps } from './Snackbar.types';

export const Snackbar: React.FC<ISnackbarProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
