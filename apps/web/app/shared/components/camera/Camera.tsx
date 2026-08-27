import React from 'react';
import { Box } from '@mui/material';
import { ICameraProps } from './Camera.types';

export const Camera: React.FC<ICameraProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
