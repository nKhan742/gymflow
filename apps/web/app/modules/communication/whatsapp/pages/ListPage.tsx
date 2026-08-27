import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Whatsapp"
      subtitle="Manage, query, and monitor whatsapp configurations and live database records in Communication."
      domain="communication"
      submodule="whatsapp"
    />
  );
};
