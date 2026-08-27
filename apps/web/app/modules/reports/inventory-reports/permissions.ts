export const INVENTORY_REPORTS_PERMISSIONS = {
  VIEW: 'reports:inventory-reports:view',
  CREATE: 'reports:inventory-reports:create',
  UPDATE: 'reports:inventory-reports:update',
  DELETE: 'reports:inventory-reports:delete',
  EXPORT: 'reports:inventory-reports:export',
  IMPORT: 'reports:inventory-reports:import',
} as const;

export type InventoryReportsPermissionType = typeof INVENTORY_REPORTS_PERMISSIONS[keyof typeof INVENTORY_REPORTS_PERMISSIONS];
