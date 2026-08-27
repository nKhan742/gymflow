import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Service History"
      subtitle="Manage, query, and monitor service history configurations and live database records in Equipment."
      domain="equipment"
      submodule="service-history"
    />
  );
};
