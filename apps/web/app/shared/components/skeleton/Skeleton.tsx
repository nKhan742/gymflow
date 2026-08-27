import React from 'react';
import { Box } from '@mui/material';
import { ISkeletonProps } from './Skeleton.types';

export const Skeleton: React.FC<ISkeletonProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
