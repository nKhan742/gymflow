import React from 'react';
import { Box } from '@mui/material';
import { IIconButtonProps } from './IconButton.types';

export const IconButton: React.FC<IIconButtonProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
