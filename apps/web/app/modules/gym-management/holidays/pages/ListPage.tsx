import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Holidays"
      subtitle="Manage, query, and monitor holidays configurations and live database records in Gym Management."
      domain="gym-management"
      submodule="holidays"
    />
  );
};
