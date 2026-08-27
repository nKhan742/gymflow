export const MAINTENANCE_PERMISSIONS = {
  VIEW: 'equipment:maintenance:view',
  CREATE: 'equipment:maintenance:create',
  UPDATE: 'equipment:maintenance:update',
  DELETE: 'equipment:maintenance:delete',
  EXPORT: 'equipment:maintenance:export',
  IMPORT: 'equipment:maintenance:import',
} as const;

export type MaintenancePermissionType = typeof MAINTENANCE_PERMISSIONS[keyof typeof MAINTENANCE_PERMISSIONS];
