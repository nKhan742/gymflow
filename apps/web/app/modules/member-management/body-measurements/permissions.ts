export const BODY_MEASUREMENTS_PERMISSIONS = {
  VIEW: 'member-management:body-measurements:view',
  CREATE: 'member-management:body-measurements:create',
  UPDATE: 'member-management:body-measurements:update',
  DELETE: 'member-management:body-measurements:delete',
  EXPORT: 'member-management:body-measurements:export',
  IMPORT: 'member-management:body-measurements:import',
} as const;

export type BodyMeasurementsPermissionType = typeof BODY_MEASUREMENTS_PERMISSIONS[keyof typeof BODY_MEASUREMENTS_PERMISSIONS];
