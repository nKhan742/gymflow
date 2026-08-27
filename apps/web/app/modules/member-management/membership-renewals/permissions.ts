export const MEMBERSHIP_RENEWALS_PERMISSIONS = {
  VIEW: 'member-management:membership-renewals:view',
  CREATE: 'member-management:membership-renewals:create',
  UPDATE: 'member-management:membership-renewals:update',
  DELETE: 'member-management:membership-renewals:delete',
  EXPORT: 'member-management:membership-renewals:export',
  IMPORT: 'member-management:membership-renewals:import',
} as const;

export type MembershipRenewalsPermissionType = typeof MEMBERSHIP_RENEWALS_PERMISSIONS[keyof typeof MEMBERSHIP_RENEWALS_PERMISSIONS];
