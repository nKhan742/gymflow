export const SERVICE_HISTORY_PERMISSIONS = {
  VIEW: 'equipment:service-history:view',
  CREATE: 'equipment:service-history:create',
  UPDATE: 'equipment:service-history:update',
  DELETE: 'equipment:service-history:delete',
  EXPORT: 'equipment:service-history:export',
  IMPORT: 'equipment:service-history:import',
} as const;

export type ServiceHistoryPermissionType = typeof SERVICE_HISTORY_PERMISSIONS[keyof typeof SERVICE_HISTORY_PERMISSIONS];
