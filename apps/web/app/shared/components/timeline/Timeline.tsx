import React from 'react';
import { Box } from '@mui/material';
import { ITimelineProps } from './Timeline.types';

export const Timeline: React.FC<ITimelineProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
