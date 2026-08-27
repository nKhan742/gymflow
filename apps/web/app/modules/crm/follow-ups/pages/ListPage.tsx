import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Follow Ups"
      subtitle="Manage, query, and monitor follow ups configurations and live database records in Crm."
      domain="crm"
      submodule="follow-ups"
    />
  );
};
