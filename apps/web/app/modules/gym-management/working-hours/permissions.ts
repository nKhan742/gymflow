export const WORKING_HOURS_PERMISSIONS = {
  VIEW: 'gym-management:working-hours:view',
  CREATE: 'gym-management:working-hours:create',
  UPDATE: 'gym-management:working-hours:update',
  DELETE: 'gym-management:working-hours:delete',
  EXPORT: 'gym-management:working-hours:export',
  IMPORT: 'gym-management:working-hours:import',
} as const;

export type WorkingHoursPermissionType = typeof WORKING_HOURS_PERMISSIONS[keyof typeof WORKING_HOURS_PERMISSIONS];
