export const PERMISSIONS_PERMISSIONS = {
  VIEW: 'administration:permissions:view',
  CREATE: 'administration:permissions:create',
  UPDATE: 'administration:permissions:update',
  DELETE: 'administration:permissions:delete',
  EXPORT: 'administration:permissions:export',
  IMPORT: 'administration:permissions:import',
} as const;

export type PermissionsPermissionType = typeof PERMISSIONS_PERMISSIONS[keyof typeof PERMISSIONS_PERMISSIONS];
