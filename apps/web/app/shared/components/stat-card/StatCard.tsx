import React from 'react';
import { Box } from '@mui/material';
import { IStatCardProps } from './StatCard.types';

export const StatCard: React.FC<IStatCardProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
