export const CHANGE_PASSWORD_PERMISSIONS = {
  VIEW: 'auth:change-password:view',
  CREATE: 'auth:change-password:create',
  UPDATE: 'auth:change-password:update',
  DELETE: 'auth:change-password:delete',
  EXPORT: 'auth:change-password:export',
  IMPORT: 'auth:change-password:import',
} as const;

export type ChangePasswordPermissionType = typeof CHANGE_PASSWORD_PERMISSIONS[keyof typeof CHANGE_PASSWORD_PERMISSIONS];
