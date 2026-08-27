import React from 'react';
import { Box } from '@mui/material';
import { IDatePickerProps } from './DatePicker.types';

export const DatePicker: React.FC<IDatePickerProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
