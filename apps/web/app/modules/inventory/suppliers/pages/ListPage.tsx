import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Suppliers"
      subtitle="Manage, query, and monitor suppliers configurations and live database records in Inventory."
      domain="inventory"
      submodule="suppliers"
    />
  );
};
