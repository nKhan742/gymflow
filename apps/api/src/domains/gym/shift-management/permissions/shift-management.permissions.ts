export const SHIFT_MANAGEMENT_PERMISSIONS = {
  VIEW: 'gym:shift-management:view',
  CREATE: 'gym:shift-management:create',
  UPDATE: 'gym:shift-management:update',
  DELETE: 'gym:shift-management:delete',
  EXPORT: 'gym:shift-management:export',
  IMPORT: 'gym:shift-management:import',
} as const;

export type ShiftManagementPermissionType = typeof SHIFT_MANAGEMENT_PERMISSIONS[keyof typeof SHIFT_MANAGEMENT_PERMISSIONS];
