import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Profile Notifications"
      subtitle="Manage, query, and monitor profile notifications configurations and live database records in Profile."
      domain="profile"
      submodule="profile-notifications"
    />
  );
};
