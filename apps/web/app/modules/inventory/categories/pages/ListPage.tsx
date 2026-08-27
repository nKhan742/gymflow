import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Categories"
      subtitle="Manage, query, and monitor categories configurations and live database records in Inventory."
      domain="inventory"
      submodule="categories"
    />
  );
};
