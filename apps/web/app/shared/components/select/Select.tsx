import React from 'react';
import { Box } from '@mui/material';
import { ISelectProps } from './Select.types';

export const Select: React.FC<ISelectProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
