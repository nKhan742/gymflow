import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { IButtonProps } from './Button.types';

export const Button: React.FC<IButtonProps> = ({ children, variant = 'contained', color = 'primary', ...rest }) => {
  return <MuiButton variant={variant} color={color} {...rest}>{children}</MuiButton>;
};
