export const FREEZE_MEMBERSHIP_PERMISSIONS = {
  VIEW: 'members:freeze-membership:view',
  CREATE: 'members:freeze-membership:create',
  UPDATE: 'members:freeze-membership:update',
  DELETE: 'members:freeze-membership:delete',
  EXPORT: 'members:freeze-membership:export',
  IMPORT: 'members:freeze-membership:import',
} as const;

export type FreezeMembershipPermissionType = typeof FREEZE_MEMBERSHIP_PERMISSIONS[keyof typeof FREEZE_MEMBERSHIP_PERMISSIONS];
