export const CALENDAR_PERMISSIONS = {
  VIEW: 'scheduling:calendar:view',
  CREATE: 'scheduling:calendar:create',
  UPDATE: 'scheduling:calendar:update',
  DELETE: 'scheduling:calendar:delete',
  EXPORT: 'scheduling:calendar:export',
  IMPORT: 'scheduling:calendar:import',
} as const;

export type CalendarPermissionType = typeof CALENDAR_PERMISSIONS[keyof typeof CALENDAR_PERMISSIONS];
