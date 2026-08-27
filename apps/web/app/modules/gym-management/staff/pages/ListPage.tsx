import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Staff"
      subtitle="Manage, query, and monitor staff configurations and live database records in Gym Management."
      domain="gym-management"
      submodule="staff"
    />
  );
};
