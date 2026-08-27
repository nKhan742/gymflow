import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Diet Plans"
      subtitle="Manage, query, and monitor diet plans configurations and live database records in Nutrition."
      domain="nutrition"
      submodule="diet-plans"
    />
  );
};
