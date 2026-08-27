import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Referrals"
      subtitle="Manage, query, and monitor referrals configurations and live database records in Crm."
      domain="crm"
      submodule="referrals"
    />
  );
};
