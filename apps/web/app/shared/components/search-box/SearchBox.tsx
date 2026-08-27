import React from 'react';
import { Box } from '@mui/material';
import { ISearchBoxProps } from './SearchBox.types';

export const SearchBox: React.FC<ISearchBoxProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
