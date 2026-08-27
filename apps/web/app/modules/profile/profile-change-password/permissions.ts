export const PROFILE_CHANGE_PASSWORD_PERMISSIONS = {
  VIEW: 'profile:profile-change-password:view',
  CREATE: 'profile:profile-change-password:create',
  UPDATE: 'profile:profile-change-password:update',
  DELETE: 'profile:profile-change-password:delete',
  EXPORT: 'profile:profile-change-password:export',
  IMPORT: 'profile:profile-change-password:import',
} as const;

export type ProfileChangePasswordPermissionType = typeof PROFILE_CHANGE_PASSWORD_PERMISSIONS[keyof typeof PROFILE_CHANGE_PASSWORD_PERMISSIONS];
