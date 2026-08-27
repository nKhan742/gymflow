export const EMAIL_PERMISSIONS = {
  VIEW: 'communication:email:view',
  CREATE: 'communication:email:create',
  UPDATE: 'communication:email:update',
  DELETE: 'communication:email:delete',
  EXPORT: 'communication:email:export',
  IMPORT: 'communication:email:import',
} as const;

export type EmailPermissionType = typeof EMAIL_PERMISSIONS[keyof typeof EMAIL_PERMISSIONS];
