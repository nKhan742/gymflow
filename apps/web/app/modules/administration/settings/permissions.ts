export const SETTINGS_PERMISSIONS = {
  VIEW: 'administration:settings:view',
  CREATE: 'administration:settings:create',
  UPDATE: 'administration:settings:update',
  DELETE: 'administration:settings:delete',
  EXPORT: 'administration:settings:export',
  IMPORT: 'administration:settings:import',
} as const;

export type SettingsPermissionType = typeof SETTINGS_PERMISSIONS[keyof typeof SETTINGS_PERMISSIONS];
