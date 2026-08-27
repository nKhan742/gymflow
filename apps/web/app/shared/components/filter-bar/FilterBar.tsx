import React from 'react';
import { Box } from '@mui/material';
import { IFilterBarProps } from './FilterBar.types';

export const FilterBar: React.FC<IFilterBarProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
