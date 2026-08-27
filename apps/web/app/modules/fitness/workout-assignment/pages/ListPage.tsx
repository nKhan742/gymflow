import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Workout Assignment"
      subtitle="Manage, query, and monitor workout assignment configurations and live database records in Fitness."
      domain="fitness"
      submodule="workout-assignment"
    />
  );
};
