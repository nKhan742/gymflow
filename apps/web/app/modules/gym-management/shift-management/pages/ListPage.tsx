import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Shift Management"
      subtitle="Manage, query, and monitor shift management configurations and live database records in Gym Management."
      domain="gym-management"
      submodule="shift-management"
    />
  );
};
