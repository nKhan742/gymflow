export const SMS_PERMISSIONS = {
  VIEW: 'communication:sms:view',
  CREATE: 'communication:sms:create',
  UPDATE: 'communication:sms:update',
  DELETE: 'communication:sms:delete',
  EXPORT: 'communication:sms:export',
  IMPORT: 'communication:sms:import',
} as const;

export type SmsPermissionType = typeof SMS_PERMISSIONS[keyof typeof SMS_PERMISSIONS];
