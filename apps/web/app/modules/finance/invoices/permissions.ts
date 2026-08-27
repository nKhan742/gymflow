export const INVOICES_PERMISSIONS = {
  VIEW: 'finance:invoices:view',
  CREATE: 'finance:invoices:create',
  UPDATE: 'finance:invoices:update',
  DELETE: 'finance:invoices:delete',
  EXPORT: 'finance:invoices:export',
  IMPORT: 'finance:invoices:import',
} as const;

export type InvoicesPermissionType = typeof INVOICES_PERMISSIONS[keyof typeof INVOICES_PERMISSIONS];
