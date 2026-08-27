import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Workout Templates"
      subtitle="Manage, query, and monitor workout templates configurations and live database records in Fitness."
      domain="fitness"
      submodule="workout-templates"
    />
  );
};
