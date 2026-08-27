export const DEPARTMENTS_PERMISSIONS = {
  VIEW: 'gym-management:departments:view',
  CREATE: 'gym-management:departments:create',
  UPDATE: 'gym-management:departments:update',
  DELETE: 'gym-management:departments:delete',
  EXPORT: 'gym-management:departments:export',
  IMPORT: 'gym-management:departments:import',
} as const;

export type DepartmentsPermissionType = typeof DEPARTMENTS_PERMISSIONS[keyof typeof DEPARTMENTS_PERMISSIONS];
