import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Inventory Stock"
      domain="inventory"
      submodule="inventory-stock"
    />
  );
};
