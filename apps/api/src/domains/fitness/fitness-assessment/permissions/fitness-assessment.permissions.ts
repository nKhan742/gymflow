export const FITNESS_ASSESSMENT_PERMISSIONS = {
  VIEW: 'fitness:fitness-assessment:view',
  CREATE: 'fitness:fitness-assessment:create',
  UPDATE: 'fitness:fitness-assessment:update',
  DELETE: 'fitness:fitness-assessment:delete',
  EXPORT: 'fitness:fitness-assessment:export',
  IMPORT: 'fitness:fitness-assessment:import',
} as const;

export type FitnessAssessmentPermissionType = typeof FITNESS_ASSESSMENT_PERMISSIONS[keyof typeof FITNESS_ASSESSMENT_PERMISSIONS];
