export const PURCHASES_PERMISSIONS = {
  VIEW: 'inventory:purchases:view',
  CREATE: 'inventory:purchases:create',
  UPDATE: 'inventory:purchases:update',
  DELETE: 'inventory:purchases:delete',
  EXPORT: 'inventory:purchases:export',
  IMPORT: 'inventory:purchases:import',
} as const;

export type PurchasesPermissionType = typeof PURCHASES_PERMISSIONS[keyof typeof PURCHASES_PERMISSIONS];
