import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Membership Reports"
      subtitle="Manage, query, and monitor membership reports configurations and live database records in Reports."
      domain="reports"
      submodule="membership-reports"
    />
  );
};
