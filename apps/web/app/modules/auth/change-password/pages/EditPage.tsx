import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '@shared/components/page-container';
import { PageHeader } from '@shared/components/page-header';
import { Card } from '@shared/components/card';

export const EditPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Change Password - Edit"
        subtitle="Manage and configure change password records."
      />
      <Card>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Change Password Edit
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Domain: Authentication | Submodule: Change Password
        </Typography>
      </Card>
    </PageContainer>
  );
};
