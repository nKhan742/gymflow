import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Inventory Reports"
      subtitle="Manage, query, and monitor inventory reports configurations and live database records in Reports."
      domain="reports"
      submodule="inventory-reports"
    />
  );
};
