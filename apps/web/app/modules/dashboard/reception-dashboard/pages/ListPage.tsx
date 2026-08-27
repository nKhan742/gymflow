import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Reception Dashboard"
      subtitle="Manage, query, and monitor reception dashboard configurations and live database records in Dashboard."
      domain="dashboard"
      submodule="reception-dashboard"
    />
  );
};
