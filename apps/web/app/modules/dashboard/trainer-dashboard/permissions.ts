export const TRAINER_DASHBOARD_PERMISSIONS = {
  VIEW: 'dashboard:trainer-dashboard:view',
  CREATE: 'dashboard:trainer-dashboard:create',
  UPDATE: 'dashboard:trainer-dashboard:update',
  DELETE: 'dashboard:trainer-dashboard:delete',
  EXPORT: 'dashboard:trainer-dashboard:export',
  IMPORT: 'dashboard:trainer-dashboard:import',
} as const;

export type TrainerDashboardPermissionType = typeof TRAINER_DASHBOARD_PERMISSIONS[keyof typeof TRAINER_DASHBOARD_PERMISSIONS];
