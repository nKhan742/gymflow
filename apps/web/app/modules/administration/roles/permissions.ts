export const ROLES_PERMISSIONS = {
  VIEW: 'administration:roles:view',
  CREATE: 'administration:roles:create',
  UPDATE: 'administration:roles:update',
  DELETE: 'administration:roles:delete',
  EXPORT: 'administration:roles:export',
  IMPORT: 'administration:roles:import',
} as const;

export type RolesPermissionType = typeof ROLES_PERMISSIONS[keyof typeof ROLES_PERMISSIONS];
