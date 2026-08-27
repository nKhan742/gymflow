export const STAFF_PERMISSIONS = {
  VIEW: 'gym:staff:view',
  CREATE: 'gym:staff:create',
  UPDATE: 'gym:staff:update',
  DELETE: 'gym:staff:delete',
  EXPORT: 'gym:staff:export',
  IMPORT: 'gym:staff:import',
} as const;

export type StaffPermissionType = typeof STAFF_PERMISSIONS[keyof typeof STAFF_PERMISSIONS];
