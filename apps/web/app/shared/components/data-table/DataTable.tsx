import React from 'react';
import { Box } from '@mui/material';
import { IDataTableProps } from './DataTable.types';

export const DataTable: React.FC<IDataTableProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
