export const REFERRALS_PERMISSIONS = {
  VIEW: 'crm:referrals:view',
  CREATE: 'crm:referrals:create',
  UPDATE: 'crm:referrals:update',
  DELETE: 'crm:referrals:delete',
  EXPORT: 'crm:referrals:export',
  IMPORT: 'crm:referrals:import',
} as const;

export type ReferralsPermissionType = typeof REFERRALS_PERMISSIONS[keyof typeof REFERRALS_PERMISSIONS];
