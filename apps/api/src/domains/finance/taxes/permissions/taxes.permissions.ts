export const TAXES_PERMISSIONS = {
  VIEW: 'finance:taxes:view',
  CREATE: 'finance:taxes:create',
  UPDATE: 'finance:taxes:update',
  DELETE: 'finance:taxes:delete',
  EXPORT: 'finance:taxes:export',
  IMPORT: 'finance:taxes:import',
} as const;

export type TaxesPermissionType = typeof TAXES_PERMISSIONS[keyof typeof TAXES_PERMISSIONS];
