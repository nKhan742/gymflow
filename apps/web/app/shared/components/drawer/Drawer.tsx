import React from 'react';
import { Box } from '@mui/material';
import { IDrawerProps } from './Drawer.types';

export const Drawer: React.FC<IDrawerProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
