import React from 'react';
import { Box } from '@mui/material';
import { IToolbarProps } from './Toolbar.types';

export const Toolbar: React.FC<IToolbarProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
