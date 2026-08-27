export const DISCOUNTS_PERMISSIONS = {
  VIEW: 'finance:discounts:view',
  CREATE: 'finance:discounts:create',
  UPDATE: 'finance:discounts:update',
  DELETE: 'finance:discounts:delete',
  EXPORT: 'finance:discounts:export',
  IMPORT: 'finance:discounts:import',
} as const;

export type DiscountsPermissionType = typeof DISCOUNTS_PERMISSIONS[keyof typeof DISCOUNTS_PERMISSIONS];
