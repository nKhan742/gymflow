export const COUPONS_PERMISSIONS = {
  VIEW: 'finance:coupons:view',
  CREATE: 'finance:coupons:create',
  UPDATE: 'finance:coupons:update',
  DELETE: 'finance:coupons:delete',
  EXPORT: 'finance:coupons:export',
  IMPORT: 'finance:coupons:import',
} as const;

export type CouponsPermissionType = typeof COUPONS_PERMISSIONS[keyof typeof COUPONS_PERMISSIONS];
