import React from 'react';
import { Box } from '@mui/material';
import { IInputProps } from './Input.types';

export const Input: React.FC<IInputProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
