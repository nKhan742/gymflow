import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Nutrition Dashboard"
      subtitle="Manage, query, and monitor nutrition dashboard configurations and live database records in Dashboard."
      domain="dashboard"
      submodule="nutrition-dashboard"
    />
  );
};
