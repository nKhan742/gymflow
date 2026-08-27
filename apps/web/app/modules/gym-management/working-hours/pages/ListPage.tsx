import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Working Hours"
      subtitle="Manage, query, and monitor working hours configurations and live database records in Gym Management."
      domain="gym-management"
      submodule="working-hours"
    />
  );
};
