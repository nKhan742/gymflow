import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Reception Dashboard"
      domain="dashboard"
      submodule="reception-dashboard"
    />
  );
};
