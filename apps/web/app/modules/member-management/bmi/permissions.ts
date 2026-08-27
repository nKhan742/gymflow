export const BMI_PERMISSIONS = {
  VIEW: 'member-management:bmi:view',
  CREATE: 'member-management:bmi:create',
  UPDATE: 'member-management:bmi:update',
  DELETE: 'member-management:bmi:delete',
  EXPORT: 'member-management:bmi:export',
  IMPORT: 'member-management:bmi:import',
} as const;

export type BmiPermissionType = typeof BMI_PERMISSIONS[keyof typeof BMI_PERMISSIONS];
