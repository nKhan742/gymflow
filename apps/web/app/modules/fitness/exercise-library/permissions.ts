export const EXERCISE_LIBRARY_PERMISSIONS = {
  VIEW: 'fitness:exercise-library:view',
  CREATE: 'fitness:exercise-library:create',
  UPDATE: 'fitness:exercise-library:update',
  DELETE: 'fitness:exercise-library:delete',
  EXPORT: 'fitness:exercise-library:export',
  IMPORT: 'fitness:exercise-library:import',
} as const;

export type ExerciseLibraryPermissionType = typeof EXERCISE_LIBRARY_PERMISSIONS[keyof typeof EXERCISE_LIBRARY_PERMISSIONS];
