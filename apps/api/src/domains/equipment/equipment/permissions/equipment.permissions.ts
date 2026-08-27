export const EQUIPMENT_PERMISSIONS = {
  VIEW: 'equipment:equipment:view',
  CREATE: 'equipment:equipment:create',
  UPDATE: 'equipment:equipment:update',
  DELETE: 'equipment:equipment:delete',
  EXPORT: 'equipment:equipment:export',
  IMPORT: 'equipment:equipment:import',
} as const;

export type EquipmentPermissionType = typeof EQUIPMENT_PERMISSIONS[keyof typeof EQUIPMENT_PERMISSIONS];
