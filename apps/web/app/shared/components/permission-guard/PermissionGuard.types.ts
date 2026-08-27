import React from 'react';
import { PermissionType } from '@core/types/rbac.types';

export interface IPermissionGuardProps {
  permission: PermissionType | PermissionType[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
