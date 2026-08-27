import React from 'react';
import { Container } from '@mui/material';
import { IPageContainerProps } from './PageContainer.types';

export const PageContainer: React.FC<IPageContainerProps> = ({ children, maxWidth = 'xl', sx, ...rest }) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters
      sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3, ...sx }}
      {...rest}
    >
      {children}
    </Container>
  );
};
