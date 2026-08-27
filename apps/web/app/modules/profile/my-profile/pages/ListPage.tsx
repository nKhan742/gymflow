import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="My Profile"
      subtitle="Manage, query, and monitor my profile configurations and live database records in Profile."
      domain="profile"
      submodule="my-profile"
    />
  );
};
