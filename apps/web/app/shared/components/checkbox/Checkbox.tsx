import React from 'react';
import { Box } from '@mui/material';
import { ICheckboxProps } from './Checkbox.types';

export const Checkbox: React.FC<ICheckboxProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
