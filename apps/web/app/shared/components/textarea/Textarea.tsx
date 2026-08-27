import React from 'react';
import { Box } from '@mui/material';
import { ITextareaProps } from './Textarea.types';

export const Textarea: React.FC<ITextareaProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
