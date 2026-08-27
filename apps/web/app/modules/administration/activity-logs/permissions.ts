export const ACTIVITY_LOGS_PERMISSIONS = {
  VIEW: 'administration:activity-logs:view',
  CREATE: 'administration:activity-logs:create',
  UPDATE: 'administration:activity-logs:update',
  DELETE: 'administration:activity-logs:delete',
  EXPORT: 'administration:activity-logs:export',
  IMPORT: 'administration:activity-logs:import',
} as const;

export type ActivityLogsPermissionType = typeof ACTIVITY_LOGS_PERMISSIONS[keyof typeof ACTIVITY_LOGS_PERMISSIONS];
