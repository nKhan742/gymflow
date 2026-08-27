export const GYM_PROFILE_PERMISSIONS = {
  VIEW: 'gym-management:gym-profile:view',
  CREATE: 'gym-management:gym-profile:create',
  UPDATE: 'gym-management:gym-profile:update',
  DELETE: 'gym-management:gym-profile:delete',
  EXPORT: 'gym-management:gym-profile:export',
  IMPORT: 'gym-management:gym-profile:import',
} as const;

export type GymProfilePermissionType = typeof GYM_PROFILE_PERMISSIONS[keyof typeof GYM_PROFILE_PERMISSIONS];
