export const ADMIN_DASHBOARD_PERMISSIONS = {
  VIEW: 'dashboard:admin-dashboard:view',
  CREATE: 'dashboard:admin-dashboard:create',
  UPDATE: 'dashboard:admin-dashboard:update',
  DELETE: 'dashboard:admin-dashboard:delete',
  EXPORT: 'dashboard:admin-dashboard:export',
  IMPORT: 'dashboard:admin-dashboard:import',
} as const;

export type AdminDashboardPermissionType = typeof ADMIN_DASHBOARD_PERMISSIONS[keyof typeof ADMIN_DASHBOARD_PERMISSIONS];
