export const DASHBOARD_ANALYTICS_PERMISSIONS = {
  VIEW: 'analytics:dashboard-analytics:view',
  CREATE: 'analytics:dashboard-analytics:create',
  UPDATE: 'analytics:dashboard-analytics:update',
  DELETE: 'analytics:dashboard-analytics:delete',
  EXPORT: 'analytics:dashboard-analytics:export',
  IMPORT: 'analytics:dashboard-analytics:import',
} as const;

export type DashboardAnalyticsPermissionType = typeof DASHBOARD_ANALYTICS_PERMISSIONS[keyof typeof DASHBOARD_ANALYTICS_PERMISSIONS];
