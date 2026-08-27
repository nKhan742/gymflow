import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Resource Booking"
      subtitle="Manage, query, and monitor resource booking configurations and live database records in Scheduling."
      domain="scheduling"
      submodule="resource-booking"
    />
  );
};
