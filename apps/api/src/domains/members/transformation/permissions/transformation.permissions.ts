export const TRANSFORMATION_PERMISSIONS = {
  VIEW: 'members:transformation:view',
  CREATE: 'members:transformation:create',
  UPDATE: 'members:transformation:update',
  DELETE: 'members:transformation:delete',
  EXPORT: 'members:transformation:export',
  IMPORT: 'members:transformation:import',
} as const;

export type TransformationPermissionType = typeof TRANSFORMATION_PERMISSIONS[keyof typeof TRANSFORMATION_PERMISSIONS];
