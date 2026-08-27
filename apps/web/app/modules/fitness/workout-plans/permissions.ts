export const WORKOUT_PLANS_PERMISSIONS = {
  VIEW: 'fitness:workout-plans:view',
  CREATE: 'fitness:workout-plans:create',
  UPDATE: 'fitness:workout-plans:update',
  DELETE: 'fitness:workout-plans:delete',
  EXPORT: 'fitness:workout-plans:export',
  IMPORT: 'fitness:workout-plans:import',
} as const;

export type WorkoutPlansPermissionType = typeof WORKOUT_PLANS_PERMISSIONS[keyof typeof WORKOUT_PLANS_PERMISSIONS];
