import React from 'react';
import { Box } from '@mui/material';
import { IDropdownProps } from './Dropdown.types';

export const Dropdown: React.FC<IDropdownProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
