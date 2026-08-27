import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Gym Profile"
      subtitle="Manage, query, and monitor gym profile configurations and live database records in Gym Management."
      domain="gym-management"
      submodule="gym-profile"
    />
  );
};
