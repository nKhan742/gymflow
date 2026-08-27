export const WATER_INTAKE_PERMISSIONS = {
  VIEW: 'nutrition:water-intake:view',
  CREATE: 'nutrition:water-intake:create',
  UPDATE: 'nutrition:water-intake:update',
  DELETE: 'nutrition:water-intake:delete',
  EXPORT: 'nutrition:water-intake:export',
  IMPORT: 'nutrition:water-intake:import',
} as const;

export type WaterIntakePermissionType = typeof WATER_INTAKE_PERMISSIONS[keyof typeof WATER_INTAKE_PERMISSIONS];
