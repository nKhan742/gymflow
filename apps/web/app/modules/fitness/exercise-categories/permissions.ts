export const EXERCISE_CATEGORIES_PERMISSIONS = {
  VIEW: 'fitness:exercise-categories:view',
  CREATE: 'fitness:exercise-categories:create',
  UPDATE: 'fitness:exercise-categories:update',
  DELETE: 'fitness:exercise-categories:delete',
  EXPORT: 'fitness:exercise-categories:export',
  IMPORT: 'fitness:exercise-categories:import',
} as const;

export type ExerciseCategoriesPermissionType = typeof EXERCISE_CATEGORIES_PERMISSIONS[keyof typeof EXERCISE_CATEGORIES_PERMISSIONS];
