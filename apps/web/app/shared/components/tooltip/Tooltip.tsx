import React from 'react';
import { Box } from '@mui/material';
import { ITooltipProps } from './Tooltip.types';

export const Tooltip: React.FC<ITooltipProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
