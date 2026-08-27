import React from 'react';
import { Box } from '@mui/material';
import { IFormProps } from './Form.types';

export const Form: React.FC<IFormProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
