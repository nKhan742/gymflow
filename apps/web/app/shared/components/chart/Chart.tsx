import React from 'react';
import { Box } from '@mui/material';
import { IChartProps } from './Chart.types';

export const Chart: React.FC<IChartProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
