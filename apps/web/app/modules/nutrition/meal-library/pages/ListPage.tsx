import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Meal Library"
      subtitle="Manage, query, and monitor meal library configurations and live database records in Nutrition."
      domain="nutrition"
      submodule="meal-library"
    />
  );
};
