import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Revenue Analytics"
      subtitle="Manage, query, and monitor revenue analytics configurations and live database records in Analytics."
      domain="analytics"
      submodule="revenue-analytics"
    />
  );
};
