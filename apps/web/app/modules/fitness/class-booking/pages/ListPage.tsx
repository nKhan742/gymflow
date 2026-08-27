import React from 'react';
import { ModuleListView } from '../../../../shared/components/module-list/ModuleListView';

export const ListPage: React.FC = () => {
  return (
    <ModuleListView
      title="Class Booking"
      subtitle="Manage, query, and monitor class booking configurations and live database records in Fitness."
      domain="fitness"
      submodule="class-booking"
    />
  );
};
