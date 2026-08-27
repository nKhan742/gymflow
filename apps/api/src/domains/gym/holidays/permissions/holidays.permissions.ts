export const HOLIDAYS_PERMISSIONS = {
  VIEW: 'gym:holidays:view',
  CREATE: 'gym:holidays:create',
  UPDATE: 'gym:holidays:update',
  DELETE: 'gym:holidays:delete',
  EXPORT: 'gym:holidays:export',
  IMPORT: 'gym:holidays:import',
} as const;

export type HolidaysPermissionType = typeof HOLIDAYS_PERMISSIONS[keyof typeof HOLIDAYS_PERMISSIONS];
