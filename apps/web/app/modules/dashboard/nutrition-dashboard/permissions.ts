export const NUTRITION_DASHBOARD_PERMISSIONS = {
  VIEW: 'dashboard:nutrition-dashboard:view',
  CREATE: 'dashboard:nutrition-dashboard:create',
  UPDATE: 'dashboard:nutrition-dashboard:update',
  DELETE: 'dashboard:nutrition-dashboard:delete',
  EXPORT: 'dashboard:nutrition-dashboard:export',
  IMPORT: 'dashboard:nutrition-dashboard:import',
} as const;

export type NutritionDashboardPermissionType = typeof NUTRITION_DASHBOARD_PERMISSIONS[keyof typeof NUTRITION_DASHBOARD_PERMISSIONS];
