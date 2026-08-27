export const PERSONAL_TRAINING_PERMISSIONS = {
  VIEW: 'fitness:personal-training:view',
  CREATE: 'fitness:personal-training:create',
  UPDATE: 'fitness:personal-training:update',
  DELETE: 'fitness:personal-training:delete',
  EXPORT: 'fitness:personal-training:export',
  IMPORT: 'fitness:personal-training:import',
} as const;

export type PersonalTrainingPermissionType = typeof PERSONAL_TRAINING_PERMISSIONS[keyof typeof PERSONAL_TRAINING_PERMISSIONS];
