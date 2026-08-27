import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Email"
      subtitle="Manage, query, and monitor email configurations and live database records in Communication."
      domain="communication"
      submodule="email"
    />
  );
};
