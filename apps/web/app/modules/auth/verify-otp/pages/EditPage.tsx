import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '@shared/components/page-container';
import { PageHeader } from '@shared/components/page-header';
import { Card } from '@shared/components/card';

export const EditPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Verify OTP - Edit"
        subtitle="Manage and configure verify otp records."
      />
      <Card>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Verify OTP Edit
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Domain: Authentication | Submodule: Verify OTP
        </Typography>
      </Card>
    </PageContainer>
  );
};
