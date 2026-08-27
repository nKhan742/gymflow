import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Dashboard Analytics"
      subtitle="Manage, query, and monitor dashboard analytics configurations and live database records in Analytics."
      domain="analytics"
      submodule="dashboard-analytics"
    />
  );
};
