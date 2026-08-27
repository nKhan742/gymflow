import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Activity Logs"
      subtitle="Manage, query, and monitor activity logs configurations and live database records in Administration."
      domain="administration"
      submodule="activity-logs"
    />
  );
};
