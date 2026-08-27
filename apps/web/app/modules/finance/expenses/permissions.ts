export const EXPENSES_PERMISSIONS = {
  VIEW: 'finance:expenses:view',
  CREATE: 'finance:expenses:create',
  UPDATE: 'finance:expenses:update',
  DELETE: 'finance:expenses:delete',
  EXPORT: 'finance:expenses:export',
  IMPORT: 'finance:expenses:import',
} as const;

export type ExpensesPermissionType = typeof EXPENSES_PERMISSIONS[keyof typeof EXPENSES_PERMISSIONS];
