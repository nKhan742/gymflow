import React from 'react';
import { Box } from '@mui/material';
import { IBadgeProps } from './Badge.types';

export const Badge: React.FC<IBadgeProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
