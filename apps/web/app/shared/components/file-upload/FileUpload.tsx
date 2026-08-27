import React from 'react';
import { Box } from '@mui/material';
import { IFileUploadProps } from './FileUpload.types';

export const FileUpload: React.FC<IFileUploadProps> = ({ children, sx, ...rest }) => {
  return <Box sx={sx} {...rest}>{children}</Box>;
};
