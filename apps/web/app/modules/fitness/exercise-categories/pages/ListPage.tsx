import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Exercise Categories"
      subtitle="Manage, query, and monitor exercise categories configurations and live database records in Fitness."
      domain="fitness"
      submodule="exercise-categories"
    />
  );
};
