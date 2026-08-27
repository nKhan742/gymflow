import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '@shared/components/page-container';
import { PageHeader } from '@shared/components/page-header';
import { Card } from '@shared/components/card';

export const CreatePage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Forgot Password - Create"
        subtitle="Manage and configure forgot password records."
      />
      <Card>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Forgot Password Create
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Domain: Authentication | Submodule: Forgot Password
        </Typography>
      </Card>
    </PageContainer>
  );
};
