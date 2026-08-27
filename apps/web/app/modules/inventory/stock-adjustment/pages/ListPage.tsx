import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Stock Adjustment"
      subtitle="Manage, query, and monitor stock adjustment configurations and live database records in Inventory."
      domain="inventory"
      submodule="stock-adjustment"
    />
  );
};
