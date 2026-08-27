import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Profile Preferences"
      subtitle="Manage, query, and monitor profile preferences configurations and live database records in Profile."
      domain="profile"
      submodule="profile-preferences"
    />
  );
};
