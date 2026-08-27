import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Settings"
      subtitle="Manage, query, and monitor settings configurations and live database records in Administration."
      domain="administration"
      submodule="settings"
    />
  );
};
