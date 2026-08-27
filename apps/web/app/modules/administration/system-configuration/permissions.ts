export const SYSTEM_CONFIGURATION_PERMISSIONS = {
  VIEW: 'administration:system-configuration:view',
  CREATE: 'administration:system-configuration:create',
  UPDATE: 'administration:system-configuration:update',
  DELETE: 'administration:system-configuration:delete',
  EXPORT: 'administration:system-configuration:export',
  IMPORT: 'administration:system-configuration:import',
} as const;

export type SystemConfigurationPermissionType = typeof SYSTEM_CONFIGURATION_PERMISSIONS[keyof typeof SYSTEM_CONFIGURATION_PERMISSIONS];
