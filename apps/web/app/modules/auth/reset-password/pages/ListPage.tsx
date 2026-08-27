import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '@shared/components/page-container';
import { PageHeader } from '@shared/components/page-header';
import { Card } from '@shared/components/card';

export const ListPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Reset Password - List"
        subtitle="Manage and configure reset password records."
      />
      <Card>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Reset Password List
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Domain: Authentication | Submodule: Reset Password
        </Typography>
      </Card>
    </PageContainer>
  );
};
