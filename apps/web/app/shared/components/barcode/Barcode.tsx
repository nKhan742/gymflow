import React from 'react';
import { Box } from '@mui/material';
import { IBarcodeProps } from './Barcode.types';

export const Barcode: React.FC<IBarcodeProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
