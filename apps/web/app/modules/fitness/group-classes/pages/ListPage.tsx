import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Group Classes"
      subtitle="Manage, query, and monitor group classes configurations and live database records in Fitness."
      domain="fitness"
      submodule="group-classes"
    />
  );
};
