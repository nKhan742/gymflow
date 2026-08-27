import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Purchases"
      subtitle="Manage, query, and monitor purchases configurations and live database records in Inventory."
      domain="inventory"
      submodule="purchases"
    />
  );
};
