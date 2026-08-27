import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Appointments"
      subtitle="Manage, query, and monitor appointments configurations and live database records in Scheduling."
      domain="scheduling"
      submodule="appointments"
    />
  );
};
