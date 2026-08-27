import React from 'react';
import { useAuthStore } from '@core/store/authStore';
import { hasPermission } from '@core/permissions/permissionUtils';
import { IPermissionGuardProps } from './PermissionGuard.types';

export const PermissionGuard: React.FC<IPermissionGuardProps> = ({ permission, fallback = null, children }) => {
  const user = useAuthStore((s) => s.user);
  if (!user || !hasPermission(user, permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
