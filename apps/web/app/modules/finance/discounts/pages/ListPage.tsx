import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Discounts"
      subtitle="Manage, query, and monitor discounts configurations and live database records in Finance."
      domain="finance"
      submodule="discounts"
    />
  );
};
