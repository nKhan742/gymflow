export const RESET_PASSWORD_PERMISSIONS = {
  VIEW: 'auth:reset-password:view',
  CREATE: 'auth:reset-password:create',
  UPDATE: 'auth:reset-password:update',
  DELETE: 'auth:reset-password:delete',
  EXPORT: 'auth:reset-password:export',
  IMPORT: 'auth:reset-password:import',
} as const;

export type ResetPasswordPermissionType = typeof RESET_PASSWORD_PERMISSIONS[keyof typeof RESET_PASSWORD_PERMISSIONS];
