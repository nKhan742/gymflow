import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Nutrition Dashboard"
      domain="dashboard"
      submodule="nutrition-dashboard"
    />
  );
};
