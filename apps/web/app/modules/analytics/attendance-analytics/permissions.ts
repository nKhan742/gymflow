export const ATTENDANCE_ANALYTICS_PERMISSIONS = {
  VIEW: 'analytics:attendance-analytics:view',
  CREATE: 'analytics:attendance-analytics:create',
  UPDATE: 'analytics:attendance-analytics:update',
  DELETE: 'analytics:attendance-analytics:delete',
  EXPORT: 'analytics:attendance-analytics:export',
  IMPORT: 'analytics:attendance-analytics:import',
} as const;

export type AttendanceAnalyticsPermissionType = typeof ATTENDANCE_ANALYTICS_PERMISSIONS[keyof typeof ATTENDANCE_ANALYTICS_PERMISSIONS];
