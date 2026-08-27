import React from 'react';
import { Box } from '@mui/material';
import { IImageUploadProps } from './ImageUpload.types';

export const ImageUpload: React.FC<IImageUploadProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
