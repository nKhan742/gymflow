import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Trainer Reports"
      subtitle="Manage, query, and monitor trainer reports configurations and live database records in Reports."
      domain="reports"
      submodule="trainer-reports"
    />
  );
};
