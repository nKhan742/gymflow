import React from 'react';
import { Box } from '@mui/material';
import { ICalendarProps } from './Calendar.types';

export const Calendar: React.FC<ICalendarProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
