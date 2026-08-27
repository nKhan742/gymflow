import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Calendar"
      subtitle="Manage, query, and monitor calendar configurations and live database records in Scheduling."
      domain="scheduling"
      submodule="calendar"
    />
  );
};
