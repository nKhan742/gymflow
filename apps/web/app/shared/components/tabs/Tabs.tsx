import React from 'react';
import { Box } from '@mui/material';
import { ITabsProps } from './Tabs.types';

export const Tabs: React.FC<ITabsProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
