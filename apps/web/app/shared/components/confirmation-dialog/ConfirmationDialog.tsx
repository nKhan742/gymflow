import React from 'react';
import { Box } from '@mui/material';
import { IConfirmationDialogProps } from './ConfirmationDialog.types';

export const ConfirmationDialog: React.FC<IConfirmationDialogProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
