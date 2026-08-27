import React from 'react';
import { Box } from '@mui/material';
import { ISwitchProps } from './Switch.types';

export const Switch: React.FC<ISwitchProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
