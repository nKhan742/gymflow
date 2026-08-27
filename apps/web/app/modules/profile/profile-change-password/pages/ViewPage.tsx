import React from 'react';
import { ModuleDetailView } from '../../../../shared/components/module-list/ModuleDetailView';

export const ViewPage: React.FC = () => {
  return (
    <ModuleDetailView
      title="Profile Change Password"
      domain="profile"
      submodule="profile-change-password"
    />
  );
};
