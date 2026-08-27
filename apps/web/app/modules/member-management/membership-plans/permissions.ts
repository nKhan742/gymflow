export const MEMBERSHIP_PLANS_PERMISSIONS = {
  VIEW: 'member-management:membership-plans:view',
  CREATE: 'member-management:membership-plans:create',
  UPDATE: 'member-management:membership-plans:update',
  DELETE: 'member-management:membership-plans:delete',
  EXPORT: 'member-management:membership-plans:export',
  IMPORT: 'member-management:membership-plans:import',
} as const;

export type MembershipPlansPermissionType = typeof MEMBERSHIP_PLANS_PERMISSIONS[keyof typeof MEMBERSHIP_PLANS_PERMISSIONS];
