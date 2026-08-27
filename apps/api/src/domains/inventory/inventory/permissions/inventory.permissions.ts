export const INVENTORY_PERMISSIONS = {
  VIEW: 'inventory:inventory:view',
  CREATE: 'inventory:inventory:create',
  UPDATE: 'inventory:inventory:update',
  DELETE: 'inventory:inventory:delete',
  EXPORT: 'inventory:inventory:export',
  IMPORT: 'inventory:inventory:import',
} as const;

export type InventoryPermissionType = typeof INVENTORY_PERMISSIONS[keyof typeof INVENTORY_PERMISSIONS];
