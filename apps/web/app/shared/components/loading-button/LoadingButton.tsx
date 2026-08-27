import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { ILoadingButtonProps } from './LoadingButton.types';

export const LoadingButton: React.FC<ILoadingButtonProps> = ({ children, loading = false, disabled, startIcon, ...rest }) => {
  return (
    <MuiButton disabled={disabled || loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon} {...rest}>
      {children}
    </MuiButton>
  );
};
