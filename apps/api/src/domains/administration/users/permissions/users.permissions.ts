export const USERS_PERMISSIONS = {
  VIEW: 'administration:users:view',
  CREATE: 'administration:users:create',
  UPDATE: 'administration:users:update',
  DELETE: 'administration:users:delete',
  EXPORT: 'administration:users:export',
  IMPORT: 'administration:users:import',
} as const;

export type UsersPermissionType = typeof USERS_PERMISSIONS[keyof typeof USERS_PERMISSIONS];
