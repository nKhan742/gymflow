import React from 'react';
import { CardProps } from '@mui/material';

export interface ICardProps extends Omit<CardProps, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}
