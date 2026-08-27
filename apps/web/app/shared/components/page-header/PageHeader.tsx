import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { IPageHeaderProps } from './PageHeader.types';

export const PageHeader: React.FC<IPageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="text.primary">{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {actions && <Stack direction="row" spacing={1.5}>{actions}</Stack>}
    </Box>
  );
};
