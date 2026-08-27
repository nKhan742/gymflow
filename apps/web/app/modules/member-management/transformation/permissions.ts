export const TRANSFORMATION_PERMISSIONS = {
  VIEW: 'member-management:transformation:view',
  CREATE: 'member-management:transformation:create',
  UPDATE: 'member-management:transformation:update',
  DELETE: 'member-management:transformation:delete',
  EXPORT: 'member-management:transformation:export',
  IMPORT: 'member-management:transformation:import',
} as const;

export type TransformationPermissionType = typeof TRANSFORMATION_PERMISSIONS[keyof typeof TRANSFORMATION_PERMISSIONS];
