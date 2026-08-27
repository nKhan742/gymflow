import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Users"
      subtitle="Manage, query, and monitor users configurations and live database records in Administration."
      domain="administration"
      submodule="users"
    />
  );
};
