export const MEMBER_ANALYTICS_PERMISSIONS = {
  VIEW: 'analytics:member-analytics:view',
  CREATE: 'analytics:member-analytics:create',
  UPDATE: 'analytics:member-analytics:update',
  DELETE: 'analytics:member-analytics:delete',
  EXPORT: 'analytics:member-analytics:export',
  IMPORT: 'analytics:member-analytics:import',
} as const;

export type MemberAnalyticsPermissionType = typeof MEMBER_ANALYTICS_PERMISSIONS[keyof typeof MEMBER_ANALYTICS_PERMISSIONS];
