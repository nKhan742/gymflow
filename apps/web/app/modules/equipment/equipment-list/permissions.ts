export const EQUIPMENT_LIST_PERMISSIONS = {
  VIEW: 'equipment:equipment-list:view',
  CREATE: 'equipment:equipment-list:create',
  UPDATE: 'equipment:equipment-list:update',
  DELETE: 'equipment:equipment-list:delete',
  EXPORT: 'equipment:equipment-list:export',
  IMPORT: 'equipment:equipment-list:import',
} as const;

export type EquipmentListPermissionType = typeof EQUIPMENT_LIST_PERMISSIONS[keyof typeof EQUIPMENT_LIST_PERMISSIONS];
