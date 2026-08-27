export const FINANCE_REPORTS_PERMISSIONS = {
  VIEW: 'reports:finance-reports:view',
  CREATE: 'reports:finance-reports:create',
  UPDATE: 'reports:finance-reports:update',
  DELETE: 'reports:finance-reports:delete',
  EXPORT: 'reports:finance-reports:export',
  IMPORT: 'reports:finance-reports:import',
} as const;

export type FinanceReportsPermissionType = typeof FINANCE_REPORTS_PERMISSIONS[keyof typeof FINANCE_REPORTS_PERMISSIONS];
