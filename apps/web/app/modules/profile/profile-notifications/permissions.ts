export const PROFILE_NOTIFICATIONS_PERMISSIONS = {
  VIEW: 'profile:profile-notifications:view',
  CREATE: 'profile:profile-notifications:create',
  UPDATE: 'profile:profile-notifications:update',
  DELETE: 'profile:profile-notifications:delete',
  EXPORT: 'profile:profile-notifications:export',
  IMPORT: 'profile:profile-notifications:import',
} as const;

export type ProfileNotificationsPermissionType = typeof PROFILE_NOTIFICATIONS_PERMISSIONS[keyof typeof PROFILE_NOTIFICATIONS_PERMISSIONS];
