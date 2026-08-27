import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Fitness Assessment"
      subtitle="Manage, query, and monitor fitness assessment configurations and live database records in Fitness."
      domain="fitness"
      submodule="fitness-assessment"
    />
  );
};
