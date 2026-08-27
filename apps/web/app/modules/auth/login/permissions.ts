export const LOGIN_PERMISSIONS = {
  VIEW: 'auth:login:view',
  CREATE: 'auth:login:create',
  UPDATE: 'auth:login:update',
  DELETE: 'auth:login:delete',
  EXPORT: 'auth:login:export',
  IMPORT: 'auth:login:import',
} as const;

export type LoginPermissionType = typeof LOGIN_PERMISSIONS[keyof typeof LOGIN_PERMISSIONS];
