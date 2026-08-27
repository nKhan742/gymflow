import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Trainer Schedule"
      subtitle="Manage, query, and monitor trainer schedule configurations and live database records in Scheduling."
      domain="scheduling"
      submodule="trainer-schedule"
    />
  );
};
