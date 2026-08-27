export const TRAINER_REPORTS_PERMISSIONS = {
  VIEW: 'reports:trainer-reports:view',
  CREATE: 'reports:trainer-reports:create',
  UPDATE: 'reports:trainer-reports:update',
  DELETE: 'reports:trainer-reports:delete',
  EXPORT: 'reports:trainer-reports:export',
  IMPORT: 'reports:trainer-reports:import',
} as const;

export type TrainerReportsPermissionType = typeof TRAINER_REPORTS_PERMISSIONS[keyof typeof TRAINER_REPORTS_PERMISSIONS];
