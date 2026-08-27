import React from 'react';
import { SxProps, Theme } from '@mui/material';

export interface IProgressProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
