import React from 'react';
import { Box } from '@mui/material';
import { IAccordionProps } from './Accordion.types';

export const Accordion: React.FC<IAccordionProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
