export const MY_PROFILE_PERMISSIONS = {
  VIEW: 'profile:my-profile:view',
  CREATE: 'profile:my-profile:create',
  UPDATE: 'profile:my-profile:update',
  DELETE: 'profile:my-profile:delete',
  EXPORT: 'profile:my-profile:export',
  IMPORT: 'profile:my-profile:import',
} as const;

export type MyProfilePermissionType = typeof MY_PROFILE_PERMISSIONS[keyof typeof MY_PROFILE_PERMISSIONS];
