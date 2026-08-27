export const DIET_PLANS_PERMISSIONS = {
  VIEW: 'nutrition:diet-plans:view',
  CREATE: 'nutrition:diet-plans:create',
  UPDATE: 'nutrition:diet-plans:update',
  DELETE: 'nutrition:diet-plans:delete',
  EXPORT: 'nutrition:diet-plans:export',
  IMPORT: 'nutrition:diet-plans:import',
} as const;

export type DietPlansPermissionType = typeof DIET_PLANS_PERMISSIONS[keyof typeof DIET_PLANS_PERMISSIONS];
