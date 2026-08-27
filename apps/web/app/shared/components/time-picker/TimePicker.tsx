import React from 'react';
import { Box } from '@mui/material';
import { ITimePickerProps } from './TimePicker.types';

export const TimePicker: React.FC<ITimePickerProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
