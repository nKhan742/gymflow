import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Personal Training"
      subtitle="Manage, query, and monitor personal training configurations and live database records in Fitness."
      domain="fitness"
      submodule="personal-training"
    />
  );
};
