import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Attendance Reports"
      subtitle="Manage, query, and monitor attendance reports configurations and live database records in Reports."
      domain="reports"
      submodule="attendance-reports"
    />
  );
};
