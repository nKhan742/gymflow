export const SALARY_PERMISSIONS = {
  VIEW: 'finance:salary:view',
  CREATE: 'finance:salary:create',
  UPDATE: 'finance:salary:update',
  DELETE: 'finance:salary:delete',
  EXPORT: 'finance:salary:export',
  IMPORT: 'finance:salary:import',
} as const;

export type SalaryPermissionType = typeof SALARY_PERMISSIONS[keyof typeof SALARY_PERMISSIONS];
