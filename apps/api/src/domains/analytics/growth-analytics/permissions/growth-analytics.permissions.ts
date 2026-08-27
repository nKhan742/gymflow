export const GROWTH_ANALYTICS_PERMISSIONS = {
  VIEW: 'analytics:growth-analytics:view',
  CREATE: 'analytics:growth-analytics:create',
  UPDATE: 'analytics:growth-analytics:update',
  DELETE: 'analytics:growth-analytics:delete',
  EXPORT: 'analytics:growth-analytics:export',
  IMPORT: 'analytics:growth-analytics:import',
} as const;

export type GrowthAnalyticsPermissionType = typeof GROWTH_ANALYTICS_PERMISSIONS[keyof typeof GROWTH_ANALYTICS_PERMISSIONS];
