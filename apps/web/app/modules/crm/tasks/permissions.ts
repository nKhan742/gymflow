export const TASKS_PERMISSIONS = {
  VIEW: 'crm:tasks:view',
  CREATE: 'crm:tasks:create',
  UPDATE: 'crm:tasks:update',
  DELETE: 'crm:tasks:delete',
  EXPORT: 'crm:tasks:export',
  IMPORT: 'crm:tasks:import',
} as const;

export type TasksPermissionType = typeof TASKS_PERMISSIONS[keyof typeof TASKS_PERMISSIONS];
