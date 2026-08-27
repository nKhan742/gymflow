export const ACCOUNTANT_DASHBOARD_PERMISSIONS = {
  VIEW: 'dashboard:accountant-dashboard:view',
  CREATE: 'dashboard:accountant-dashboard:create',
  UPDATE: 'dashboard:accountant-dashboard:update',
  DELETE: 'dashboard:accountant-dashboard:delete',
  EXPORT: 'dashboard:accountant-dashboard:export',
  IMPORT: 'dashboard:accountant-dashboard:import',
} as const;

export type AccountantDashboardPermissionType = typeof ACCOUNTANT_DASHBOARD_PERMISSIONS[keyof typeof ACCOUNTANT_DASHBOARD_PERMISSIONS];
