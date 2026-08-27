import React from 'react';
import { SxProps, Theme } from '@mui/material';

export interface IMemberCardProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
