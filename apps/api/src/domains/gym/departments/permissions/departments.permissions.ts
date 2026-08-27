export const DEPARTMENTS_PERMISSIONS = {
  VIEW: 'gym:departments:view',
  CREATE: 'gym:departments:create',
  UPDATE: 'gym:departments:update',
  DELETE: 'gym:departments:delete',
  EXPORT: 'gym:departments:export',
  IMPORT: 'gym:departments:import',
} as const;

export type DepartmentsPermissionType = typeof DEPARTMENTS_PERMISSIONS[keyof typeof DEPARTMENTS_PERMISSIONS];
