export const STAFF_PERMISSIONS = {
  VIEW: 'gym-management:staff:view',
  CREATE: 'gym-management:staff:create',
  UPDATE: 'gym-management:staff:update',
  DELETE: 'gym-management:staff:delete',
  EXPORT: 'gym-management:staff:export',
  IMPORT: 'gym-management:staff:import',
} as const;

export type StaffPermissionType = typeof STAFF_PERMISSIONS[keyof typeof STAFF_PERMISSIONS];
