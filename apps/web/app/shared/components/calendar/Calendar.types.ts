import React from 'react';
import { SxProps, Theme } from '@mui/material';

export interface ICalendarProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
