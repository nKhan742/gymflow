import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Trainer Commission"
      subtitle="Manage, query, and monitor trainer commission configurations and live database records in Finance."
      domain="finance"
      submodule="trainer-commission"
    />
  );
};
