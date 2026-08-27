export const SUPPLIERS_PERMISSIONS = {
  VIEW: 'inventory:suppliers:view',
  CREATE: 'inventory:suppliers:create',
  UPDATE: 'inventory:suppliers:update',
  DELETE: 'inventory:suppliers:delete',
  EXPORT: 'inventory:suppliers:export',
  IMPORT: 'inventory:suppliers:import',
} as const;

export type SuppliersPermissionType = typeof SUPPLIERS_PERMISSIONS[keyof typeof SUPPLIERS_PERMISSIONS];
