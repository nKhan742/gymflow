import React from 'react';
import { Box } from '@mui/material';
import { ITableProps } from './Table.types';

export const Table: React.FC<ITableProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
