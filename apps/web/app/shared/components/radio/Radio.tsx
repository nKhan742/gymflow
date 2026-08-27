import React from 'react';
import { Box } from '@mui/material';
import { IRadioProps } from './Radio.types';

export const Radio: React.FC<IRadioProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
