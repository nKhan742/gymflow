export const SHIFT_MANAGEMENT_PERMISSIONS = {
  VIEW: 'gym-management:shift-management:view',
  CREATE: 'gym-management:shift-management:create',
  UPDATE: 'gym-management:shift-management:update',
  DELETE: 'gym-management:shift-management:delete',
  EXPORT: 'gym-management:shift-management:export',
  IMPORT: 'gym-management:shift-management:import',
} as const;

export type ShiftManagementPermissionType = typeof SHIFT_MANAGEMENT_PERMISSIONS[keyof typeof SHIFT_MANAGEMENT_PERMISSIONS];
