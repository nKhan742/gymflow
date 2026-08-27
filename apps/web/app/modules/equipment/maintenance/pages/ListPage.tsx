import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Maintenance"
      subtitle="Manage, query, and monitor maintenance configurations and live database records in Equipment."
      domain="equipment"
      submodule="maintenance"
    />
  );
};
