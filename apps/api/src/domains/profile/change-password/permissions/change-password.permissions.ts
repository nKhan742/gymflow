export const CHANGE_PASSWORD_PERMISSIONS = {
  VIEW: 'profile:change-password:view',
  CREATE: 'profile:change-password:create',
  UPDATE: 'profile:change-password:update',
  DELETE: 'profile:change-password:delete',
  EXPORT: 'profile:change-password:export',
  IMPORT: 'profile:change-password:import',
} as const;

export type ChangePasswordPermissionType = typeof CHANGE_PASSWORD_PERMISSIONS[keyof typeof CHANGE_PASSWORD_PERMISSIONS];
