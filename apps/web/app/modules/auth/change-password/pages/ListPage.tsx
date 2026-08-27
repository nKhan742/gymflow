import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Change Password"
      subtitle="Manage, query, and monitor change password configurations and live database records in Auth."
      domain="auth"
      submodule="change-password"
    />
  );
};
