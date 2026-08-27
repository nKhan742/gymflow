import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Revenue Analytics"
      domain="analytics"
      submodule="revenue-analytics"
    />
  );
};
