export const FOLLOW_UPS_PERMISSIONS = {
  VIEW: 'crm:follow-ups:view',
  CREATE: 'crm:follow-ups:create',
  UPDATE: 'crm:follow-ups:update',
  DELETE: 'crm:follow-ups:delete',
  EXPORT: 'crm:follow-ups:export',
  IMPORT: 'crm:follow-ups:import',
} as const;

export type FollowUpsPermissionType = typeof FOLLOW_UPS_PERMISSIONS[keyof typeof FOLLOW_UPS_PERMISSIONS];
