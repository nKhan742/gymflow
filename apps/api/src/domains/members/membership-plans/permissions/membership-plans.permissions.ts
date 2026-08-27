export const MEMBERSHIP_PLANS_PERMISSIONS = {
  VIEW: 'members:membership-plans:view',
  CREATE: 'members:membership-plans:create',
  UPDATE: 'members:membership-plans:update',
  DELETE: 'members:membership-plans:delete',
  EXPORT: 'members:membership-plans:export',
  IMPORT: 'members:membership-plans:import',
} as const;

export type MembershipPlansPermissionType = typeof MEMBERSHIP_PLANS_PERMISSIONS[keyof typeof MEMBERSHIP_PLANS_PERMISSIONS];
