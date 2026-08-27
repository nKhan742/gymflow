export const WORKING_HOURS_PERMISSIONS = {
  VIEW: 'gym:working-hours:view',
  CREATE: 'gym:working-hours:create',
  UPDATE: 'gym:working-hours:update',
  DELETE: 'gym:working-hours:delete',
  EXPORT: 'gym:working-hours:export',
  IMPORT: 'gym:working-hours:import',
} as const;

export type WorkingHoursPermissionType = typeof WORKING_HOURS_PERMISSIONS[keyof typeof WORKING_HOURS_PERMISSIONS];
