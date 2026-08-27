import React from 'react';
import { Box } from '@mui/material';
import { IChipProps } from './Chip.types';

export const Chip: React.FC<IChipProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
