export const ATTENDANCE_PERMISSIONS = {
  VIEW: 'members:attendance:view',
  CREATE: 'members:attendance:create',
  UPDATE: 'members:attendance:update',
  DELETE: 'members:attendance:delete',
  EXPORT: 'members:attendance:export',
  IMPORT: 'members:attendance:import',
} as const;

export type AttendancePermissionType = typeof ATTENDANCE_PERMISSIONS[keyof typeof ATTENDANCE_PERMISSIONS];
