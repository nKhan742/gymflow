export const APPOINTMENTS_PERMISSIONS = {
  VIEW: 'scheduling:appointments:view',
  CREATE: 'scheduling:appointments:create',
  UPDATE: 'scheduling:appointments:update',
  DELETE: 'scheduling:appointments:delete',
  EXPORT: 'scheduling:appointments:export',
  IMPORT: 'scheduling:appointments:import',
} as const;

export type AppointmentsPermissionType = typeof APPOINTMENTS_PERMISSIONS[keyof typeof APPOINTMENTS_PERMISSIONS];
