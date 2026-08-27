import React from 'react';
import { Box } from '@mui/material';
import { IBreadcrumbProps } from './Breadcrumb.types';

export const Breadcrumb: React.FC<IBreadcrumbProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
