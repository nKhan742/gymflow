export const FORGOT_PASSWORD_PERMISSIONS = {
  VIEW: 'auth:forgot-password:view',
  CREATE: 'auth:forgot-password:create',
  UPDATE: 'auth:forgot-password:update',
  DELETE: 'auth:forgot-password:delete',
  EXPORT: 'auth:forgot-password:export',
  IMPORT: 'auth:forgot-password:import',
} as const;

export type ForgotPasswordPermissionType = typeof FORGOT_PASSWORD_PERMISSIONS[keyof typeof FORGOT_PASSWORD_PERMISSIONS];
