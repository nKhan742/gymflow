import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Nutrition Tracking"
      subtitle="Manage, query, and monitor nutrition tracking configurations and live database records in Nutrition."
      domain="nutrition"
      submodule="nutrition-tracking"
    />
  );
};
