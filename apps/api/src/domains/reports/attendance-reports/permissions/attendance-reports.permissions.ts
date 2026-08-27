export const ATTENDANCE_REPORTS_PERMISSIONS = {
  VIEW: 'reports:attendance-reports:view',
  CREATE: 'reports:attendance-reports:create',
  UPDATE: 'reports:attendance-reports:update',
  DELETE: 'reports:attendance-reports:delete',
  EXPORT: 'reports:attendance-reports:export',
  IMPORT: 'reports:attendance-reports:import',
} as const;

export type AttendanceReportsPermissionType = typeof ATTENDANCE_REPORTS_PERMISSIONS[keyof typeof ATTENDANCE_REPORTS_PERMISSIONS];
