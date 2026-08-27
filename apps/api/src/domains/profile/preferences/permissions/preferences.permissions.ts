export const PREFERENCES_PERMISSIONS = {
  VIEW: 'profile:preferences:view',
  CREATE: 'profile:preferences:create',
  UPDATE: 'profile:preferences:update',
  DELETE: 'profile:preferences:delete',
  EXPORT: 'profile:preferences:export',
  IMPORT: 'profile:preferences:import',
} as const;

export type PreferencesPermissionType = typeof PREFERENCES_PERMISSIONS[keyof typeof PREFERENCES_PERMISSIONS];
