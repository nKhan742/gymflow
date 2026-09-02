import { PermissionType } from '../types/rbac.types';
import { IUserProfile } from '../types/user.types';
import { ROLE_PERMISSIONS } from './rbacMatrix';

export const hasPermission = (
  user: IUserProfile | null | undefined,
  permission: PermissionType | PermissionType[]
): boolean => {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'GYM_OWNER') return true;

  const rolePerms = ROLE_PERMISSIONS[user.role] || [];
  const allUserPerms = new Set([...rolePerms, ...(user.permissions || [])]);

  if (Array.isArray(permission)) {
    return permission.some((p) => allUserPerms.has(p));
  }

  return allUserPerms.has(permission);
};

export const hasAllPermissions = (
  user: IUserProfile | null | undefined,
  permissions: PermissionType[]
): boolean => {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'GYM_OWNER') return true;

  const rolePerms = ROLE_PERMISSIONS[user.role] || [];
  const allUserPerms = new Set([...rolePerms, ...(user.permissions || [])]);

  return permissions.every((p) => allUserPerms.has(p));
};
