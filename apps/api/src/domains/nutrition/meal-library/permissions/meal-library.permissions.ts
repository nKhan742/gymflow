export const MEAL_LIBRARY_PERMISSIONS = {
  VIEW: 'nutrition:meal-library:view',
  CREATE: 'nutrition:meal-library:create',
  UPDATE: 'nutrition:meal-library:update',
  DELETE: 'nutrition:meal-library:delete',
  EXPORT: 'nutrition:meal-library:export',
  IMPORT: 'nutrition:meal-library:import',
} as const;

export type MealLibraryPermissionType = typeof MEAL_LIBRARY_PERMISSIONS[keyof typeof MEAL_LIBRARY_PERMISSIONS];
