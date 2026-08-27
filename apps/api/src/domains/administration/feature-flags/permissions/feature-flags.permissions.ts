export const FEATURE_FLAGS_PERMISSIONS = {
  VIEW: 'administration:feature-flags:view',
  CREATE: 'administration:feature-flags:create',
  UPDATE: 'administration:feature-flags:update',
  DELETE: 'administration:feature-flags:delete',
  EXPORT: 'administration:feature-flags:export',
  IMPORT: 'administration:feature-flags:import',
} as const;

export type FeatureFlagsPermissionType = typeof FEATURE_FLAGS_PERMISSIONS[keyof typeof FEATURE_FLAGS_PERMISSIONS];
