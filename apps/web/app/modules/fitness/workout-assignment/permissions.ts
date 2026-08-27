export const WORKOUT_ASSIGNMENT_PERMISSIONS = {
  VIEW: 'fitness:workout-assignment:view',
  CREATE: 'fitness:workout-assignment:create',
  UPDATE: 'fitness:workout-assignment:update',
  DELETE: 'fitness:workout-assignment:delete',
  EXPORT: 'fitness:workout-assignment:export',
  IMPORT: 'fitness:workout-assignment:import',
} as const;

export type WorkoutAssignmentPermissionType = typeof WORKOUT_ASSIGNMENT_PERMISSIONS[keyof typeof WORKOUT_ASSIGNMENT_PERMISSIONS];
