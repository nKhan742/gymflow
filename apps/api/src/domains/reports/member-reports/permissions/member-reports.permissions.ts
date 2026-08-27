export const MEMBER_REPORTS_PERMISSIONS = {
  VIEW: 'reports:member-reports:view',
  CREATE: 'reports:member-reports:create',
  UPDATE: 'reports:member-reports:update',
  DELETE: 'reports:member-reports:delete',
  EXPORT: 'reports:member-reports:export',
  IMPORT: 'reports:member-reports:import',
} as const;

export type MemberReportsPermissionType = typeof MEMBER_REPORTS_PERMISSIONS[keyof typeof MEMBER_REPORTS_PERMISSIONS];
