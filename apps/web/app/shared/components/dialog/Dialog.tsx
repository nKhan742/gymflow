import React from 'react';
import { Box } from '@mui/material';
import { IDialogProps } from './Dialog.types';

export const Dialog: React.FC<IDialogProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
