export const BMI_PERMISSIONS = {
  VIEW: 'members:bmi:view',
  CREATE: 'members:bmi:create',
  UPDATE: 'members:bmi:update',
  DELETE: 'members:bmi:delete',
  EXPORT: 'members:bmi:export',
  IMPORT: 'members:bmi:import',
} as const;

export type BmiPermissionType = typeof BMI_PERMISSIONS[keyof typeof BMI_PERMISSIONS];
