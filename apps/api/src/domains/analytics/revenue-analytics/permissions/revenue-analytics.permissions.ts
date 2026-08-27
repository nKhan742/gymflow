export const REVENUE_ANALYTICS_PERMISSIONS = {
  VIEW: 'analytics:revenue-analytics:view',
  CREATE: 'analytics:revenue-analytics:create',
  UPDATE: 'analytics:revenue-analytics:update',
  DELETE: 'analytics:revenue-analytics:delete',
  EXPORT: 'analytics:revenue-analytics:export',
  IMPORT: 'analytics:revenue-analytics:import',
} as const;

export type RevenueAnalyticsPermissionType = typeof REVENUE_ANALYTICS_PERMISSIONS[keyof typeof REVENUE_ANALYTICS_PERMISSIONS];
