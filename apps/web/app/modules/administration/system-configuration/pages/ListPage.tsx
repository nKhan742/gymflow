import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="System Configuration"
      subtitle="Manage, query, and monitor system configuration configurations and live database records in Administration."
      domain="administration"
      submodule="system-configuration"
    />
  );
};
