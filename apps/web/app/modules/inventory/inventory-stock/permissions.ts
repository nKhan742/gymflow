export const INVENTORY_STOCK_PERMISSIONS = {
  VIEW: 'inventory:inventory-stock:view',
  CREATE: 'inventory:inventory-stock:create',
  UPDATE: 'inventory:inventory-stock:update',
  DELETE: 'inventory:inventory-stock:delete',
  EXPORT: 'inventory:inventory-stock:export',
  IMPORT: 'inventory:inventory-stock:import',
} as const;

export type InventoryStockPermissionType = typeof INVENTORY_STOCK_PERMISSIONS[keyof typeof INVENTORY_STOCK_PERMISSIONS];
