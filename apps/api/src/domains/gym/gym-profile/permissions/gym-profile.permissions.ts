export const GYM_PROFILE_PERMISSIONS = {
  VIEW: 'gym:gym-profile:view',
  CREATE: 'gym:gym-profile:create',
  UPDATE: 'gym:gym-profile:update',
  DELETE: 'gym:gym-profile:delete',
  EXPORT: 'gym:gym-profile:export',
  IMPORT: 'gym:gym-profile:import',
} as const;

export type GymProfilePermissionType = typeof GYM_PROFILE_PERMISSIONS[keyof typeof GYM_PROFILE_PERMISSIONS];
