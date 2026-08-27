export const FREEZE_MEMBERSHIP_PERMISSIONS = {
  VIEW: 'member-management:freeze-membership:view',
  CREATE: 'member-management:freeze-membership:create',
  UPDATE: 'member-management:freeze-membership:update',
  DELETE: 'member-management:freeze-membership:delete',
  EXPORT: 'member-management:freeze-membership:export',
  IMPORT: 'member-management:freeze-membership:import',
} as const;

export type FreezeMembershipPermissionType = typeof FREEZE_MEMBERSHIP_PERMISSIONS[keyof typeof FREEZE_MEMBERSHIP_PERMISSIONS];
