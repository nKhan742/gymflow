import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Verify Otp"
      subtitle="Manage, query, and monitor verify otp configurations and live database records in Auth."
      domain="auth"
      submodule="verify-otp"
    />
  );
};
