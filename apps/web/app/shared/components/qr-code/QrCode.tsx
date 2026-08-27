import React from 'react';
import { Box } from '@mui/material';
import { IQrCodeProps } from './QrCode.types';

export const QrCode: React.FC<IQrCodeProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
