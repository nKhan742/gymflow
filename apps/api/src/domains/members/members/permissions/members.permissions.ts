export const MEMBERS_PERMISSIONS = {
  VIEW: 'members:members:view',
  CREATE: 'members:members:create',
  UPDATE: 'members:members:update',
  DELETE: 'members:members:delete',
  EXPORT: 'members:members:export',
  IMPORT: 'members:members:import',
} as const;

export type MembersPermissionType = typeof MEMBERS_PERMISSIONS[keyof typeof MEMBERS_PERMISSIONS];
