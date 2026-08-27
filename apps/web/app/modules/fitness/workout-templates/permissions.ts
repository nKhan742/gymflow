export const WORKOUT_TEMPLATES_PERMISSIONS = {
  VIEW: 'fitness:workout-templates:view',
  CREATE: 'fitness:workout-templates:create',
  UPDATE: 'fitness:workout-templates:update',
  DELETE: 'fitness:workout-templates:delete',
  EXPORT: 'fitness:workout-templates:export',
  IMPORT: 'fitness:workout-templates:import',
} as const;

export type WorkoutTemplatesPermissionType = typeof WORKOUT_TEMPLATES_PERMISSIONS[keyof typeof WORKOUT_TEMPLATES_PERMISSIONS];
