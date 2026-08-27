export const NOTIFICATIONS_PERMISSIONS = {
  VIEW: 'communication:notifications:view',
  CREATE: 'communication:notifications:create',
  UPDATE: 'communication:notifications:update',
  DELETE: 'communication:notifications:delete',
  EXPORT: 'communication:notifications:export',
  IMPORT: 'communication:notifications:import',
} as const;

export type NotificationsPermissionType = typeof NOTIFICATIONS_PERMISSIONS[keyof typeof NOTIFICATIONS_PERMISSIONS];
