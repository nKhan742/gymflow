import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Tasks"
      subtitle="Manage, query, and monitor tasks configurations and live database records in Crm."
      domain="crm"
      submodule="tasks"
    />
  );
};
