import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Roles"
      subtitle="Manage, query, and monitor roles configurations and live database records in Administration."
      domain="administration"
      submodule="roles"
    />
  );
};
