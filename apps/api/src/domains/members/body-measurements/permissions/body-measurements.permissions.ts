export const BODY_MEASUREMENTS_PERMISSIONS = {
  VIEW: 'members:body-measurements:view',
  CREATE: 'members:body-measurements:create',
  UPDATE: 'members:body-measurements:update',
  DELETE: 'members:body-measurements:delete',
  EXPORT: 'members:body-measurements:export',
  IMPORT: 'members:body-measurements:import',
} as const;

export type BodyMeasurementsPermissionType = typeof BODY_MEASUREMENTS_PERMISSIONS[keyof typeof BODY_MEASUREMENTS_PERMISSIONS];
