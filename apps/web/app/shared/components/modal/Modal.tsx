import React from 'react';
import { Box } from '@mui/material';
import { IModalProps } from './Modal.types';

export const Modal: React.FC<IModalProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
