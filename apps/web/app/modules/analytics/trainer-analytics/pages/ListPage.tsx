import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Trainer Analytics"
      subtitle="Manage, query, and monitor trainer analytics configurations and live database records in Analytics."
      domain="analytics"
      submodule="trainer-analytics"
    />
  );
};
