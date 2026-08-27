import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Notifications"
      subtitle="Manage, query, and monitor notifications configurations and live database records in Communication."
      domain="communication"
      submodule="notifications"
    />
  );
};
