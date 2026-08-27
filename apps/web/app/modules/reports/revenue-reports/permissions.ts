export const REVENUE_REPORTS_PERMISSIONS = {
  VIEW: 'reports:revenue-reports:view',
  CREATE: 'reports:revenue-reports:create',
  UPDATE: 'reports:revenue-reports:update',
  DELETE: 'reports:revenue-reports:delete',
  EXPORT: 'reports:revenue-reports:export',
  IMPORT: 'reports:revenue-reports:import',
} as const;

export type RevenueReportsPermissionType = typeof REVENUE_REPORTS_PERMISSIONS[keyof typeof REVENUE_REPORTS_PERMISSIONS];
