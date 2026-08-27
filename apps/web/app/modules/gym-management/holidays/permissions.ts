export const HOLIDAYS_PERMISSIONS = {
  VIEW: 'gym-management:holidays:view',
  CREATE: 'gym-management:holidays:create',
  UPDATE: 'gym-management:holidays:update',
  DELETE: 'gym-management:holidays:delete',
  EXPORT: 'gym-management:holidays:export',
  IMPORT: 'gym-management:holidays:import',
} as const;

export type HolidaysPermissionType = typeof HOLIDAYS_PERMISSIONS[keyof typeof HOLIDAYS_PERMISSIONS];
