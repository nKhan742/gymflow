import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Membership Reports"
      domain="reports"
      submodule="membership-reports"
    />
  );
};
