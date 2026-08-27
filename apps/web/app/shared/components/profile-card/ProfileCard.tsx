import React from 'react';
import { Box } from '@mui/material';
import { IProfileCardProps } from './ProfileCard.types';

export const ProfileCard: React.FC<IProfileCardProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
