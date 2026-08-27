export const PRODUCTS_PERMISSIONS = {
  VIEW: 'inventory:products:view',
  CREATE: 'inventory:products:create',
  UPDATE: 'inventory:products:update',
  DELETE: 'inventory:products:delete',
  EXPORT: 'inventory:products:export',
  IMPORT: 'inventory:products:import',
} as const;

export type ProductsPermissionType = typeof PRODUCTS_PERMISSIONS[keyof typeof PRODUCTS_PERMISSIONS];
