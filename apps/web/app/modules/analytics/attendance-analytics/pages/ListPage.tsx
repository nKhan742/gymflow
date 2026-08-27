import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Attendance Analytics"
      subtitle="Manage, query, and monitor attendance analytics configurations and live database records in Analytics."
      domain="analytics"
      submodule="attendance-analytics"
    />
  );
};
