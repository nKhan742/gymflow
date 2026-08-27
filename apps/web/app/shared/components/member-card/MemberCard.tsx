import React from 'react';
import { Box } from '@mui/material';
import { IMemberCardProps } from './MemberCard.types';

export const MemberCard: React.FC<IMemberCardProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
