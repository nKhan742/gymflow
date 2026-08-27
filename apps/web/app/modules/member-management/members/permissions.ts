export const MEMBERS_PERMISSIONS = {
  VIEW: 'member-management:members:view',
  CREATE: 'member-management:members:create',
  UPDATE: 'member-management:members:update',
  DELETE: 'member-management:members:delete',
  EXPORT: 'member-management:members:export',
  IMPORT: 'member-management:members:import',
} as const;

export type MembersPermissionType = typeof MEMBERS_PERMISSIONS[keyof typeof MEMBERS_PERMISSIONS];
