import React from 'react';
import { Box } from '@mui/material';
import { IPaginationProps } from './Pagination.types';

export const Pagination: React.FC<IPaginationProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
