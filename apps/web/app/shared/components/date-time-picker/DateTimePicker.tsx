import React from 'react';
import { Box } from '@mui/material';
import { IDateTimePickerProps } from './DateTimePicker.types';

export const DateTimePicker: React.FC<IDateTimePickerProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
