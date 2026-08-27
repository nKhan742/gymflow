import React from 'react';
import { Box } from '@mui/material';
import { IPopoverProps } from './Popover.types';

export const Popover: React.FC<IPopoverProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
