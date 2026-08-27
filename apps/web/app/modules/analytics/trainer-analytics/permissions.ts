export const TRAINER_ANALYTICS_PERMISSIONS = {
  VIEW: 'analytics:trainer-analytics:view',
  CREATE: 'analytics:trainer-analytics:create',
  UPDATE: 'analytics:trainer-analytics:update',
  DELETE: 'analytics:trainer-analytics:delete',
  EXPORT: 'analytics:trainer-analytics:export',
  IMPORT: 'analytics:trainer-analytics:import',
} as const;

export type TrainerAnalyticsPermissionType = typeof TRAINER_ANALYTICS_PERMISSIONS[keyof typeof TRAINER_ANALYTICS_PERMISSIONS];
