export const MEMBER_DASHBOARD_PERMISSIONS = {
  VIEW: 'dashboard:member-dashboard:view',
  CREATE: 'dashboard:member-dashboard:create',
  UPDATE: 'dashboard:member-dashboard:update',
  DELETE: 'dashboard:member-dashboard:delete',
  EXPORT: 'dashboard:member-dashboard:export',
  IMPORT: 'dashboard:member-dashboard:import',
} as const;

export type MemberDashboardPermissionType = typeof MEMBER_DASHBOARD_PERMISSIONS[keyof typeof MEMBER_DASHBOARD_PERMISSIONS];
