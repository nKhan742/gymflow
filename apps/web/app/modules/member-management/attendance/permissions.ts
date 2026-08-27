export const ATTENDANCE_PERMISSIONS = {
  VIEW: 'member-management:attendance:view',
  CREATE: 'member-management:attendance:create',
  UPDATE: 'member-management:attendance:update',
  DELETE: 'member-management:attendance:delete',
  EXPORT: 'member-management:attendance:export',
  IMPORT: 'member-management:attendance:import',
} as const;

export type AttendancePermissionType = typeof ATTENDANCE_PERMISSIONS[keyof typeof ATTENDANCE_PERMISSIONS];
