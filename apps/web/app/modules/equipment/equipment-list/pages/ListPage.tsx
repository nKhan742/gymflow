import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Equipment List"
      subtitle="Manage, query, and monitor equipment list configurations and live database records in Equipment."
      domain="equipment"
      submodule="equipment-list"
    />
  );
};
