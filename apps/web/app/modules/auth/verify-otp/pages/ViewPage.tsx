import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Verify Otp"
      domain="auth"
      submodule="verify-otp"
    />
  );
};
