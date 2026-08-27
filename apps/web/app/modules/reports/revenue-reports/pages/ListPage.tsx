import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Revenue Reports"
      subtitle="Manage, query, and monitor revenue reports configurations and live database records in Reports."
      domain="reports"
      submodule="revenue-reports"
    />
  );
};
