import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Permissions"
      subtitle="Manage, query, and monitor permissions configurations and live database records in Administration."
      domain="administration"
      submodule="permissions"
    />
  );
};
