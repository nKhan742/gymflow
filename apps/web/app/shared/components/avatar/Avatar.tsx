import React from 'react';
import { Box } from '@mui/material';
import { IAvatarProps } from './Avatar.types';

export const Avatar: React.FC<IAvatarProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
