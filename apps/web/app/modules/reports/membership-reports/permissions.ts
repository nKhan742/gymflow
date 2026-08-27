export const MEMBERSHIP_REPORTS_PERMISSIONS = {
  VIEW: 'reports:membership-reports:view',
  CREATE: 'reports:membership-reports:create',
  UPDATE: 'reports:membership-reports:update',
  DELETE: 'reports:membership-reports:delete',
  EXPORT: 'reports:membership-reports:export',
  IMPORT: 'reports:membership-reports:import',
} as const;

export type MembershipReportsPermissionType = typeof MEMBERSHIP_REPORTS_PERMISSIONS[keyof typeof MEMBERSHIP_REPORTS_PERMISSIONS];
