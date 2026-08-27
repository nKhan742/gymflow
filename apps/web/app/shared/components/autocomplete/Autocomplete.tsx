import React from 'react';
import { Box } from '@mui/material';
import { IAutocompleteProps } from './Autocomplete.types';

export const Autocomplete: React.FC<IAutocompleteProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
