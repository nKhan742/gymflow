export const MEMBERSHIP_RENEWALS_PERMISSIONS = {
  VIEW: 'members:membership-renewals:view',
  CREATE: 'members:membership-renewals:create',
  UPDATE: 'members:membership-renewals:update',
  DELETE: 'members:membership-renewals:delete',
  EXPORT: 'members:membership-renewals:export',
  IMPORT: 'members:membership-renewals:import',
} as const;

export type MembershipRenewalsPermissionType = typeof MEMBERSHIP_RENEWALS_PERMISSIONS[keyof typeof MEMBERSHIP_RENEWALS_PERMISSIONS];
