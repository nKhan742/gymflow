export const PROFILE_PREFERENCES_PERMISSIONS = {
  VIEW: 'profile:profile-preferences:view',
  CREATE: 'profile:profile-preferences:create',
  UPDATE: 'profile:profile-preferences:update',
  DELETE: 'profile:profile-preferences:delete',
  EXPORT: 'profile:profile-preferences:export',
  IMPORT: 'profile:profile-preferences:import',
} as const;

export type ProfilePreferencesPermissionType = typeof PROFILE_PREFERENCES_PERMISSIONS[keyof typeof PROFILE_PREFERENCES_PERMISSIONS];
