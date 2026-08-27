import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Inventory Stock"
      subtitle="Manage, query, and monitor inventory stock configurations and live database records in Inventory."
      domain="inventory"
      submodule="inventory-stock"
    />
  );
};
