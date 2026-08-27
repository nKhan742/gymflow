export const STOCK_ADJUSTMENT_PERMISSIONS = {
  VIEW: 'inventory:stock-adjustment:view',
  CREATE: 'inventory:stock-adjustment:create',
  UPDATE: 'inventory:stock-adjustment:update',
  DELETE: 'inventory:stock-adjustment:delete',
  EXPORT: 'inventory:stock-adjustment:export',
  IMPORT: 'inventory:stock-adjustment:import',
} as const;

export type StockAdjustmentPermissionType = typeof STOCK_ADJUSTMENT_PERMISSIONS[keyof typeof STOCK_ADJUSTMENT_PERMISSIONS];
