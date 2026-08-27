export const NUTRITION_TRACKING_PERMISSIONS = {
  VIEW: 'nutrition:nutrition-tracking:view',
  CREATE: 'nutrition:nutrition-tracking:create',
  UPDATE: 'nutrition:nutrition-tracking:update',
  DELETE: 'nutrition:nutrition-tracking:delete',
  EXPORT: 'nutrition:nutrition-tracking:export',
  IMPORT: 'nutrition:nutrition-tracking:import',
} as const;

export type NutritionTrackingPermissionType = typeof NUTRITION_TRACKING_PERMISSIONS[keyof typeof NUTRITION_TRACKING_PERMISSIONS];
