import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Trial Members"
      subtitle="Manage, query, and monitor trial members configurations and live database records in Crm."
      domain="crm"
      submodule="trial-members"
    />
  );
};
