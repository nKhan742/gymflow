export const POS_PERMISSIONS = {
  VIEW: 'finance:pos:view',
  CREATE: 'finance:pos:create',
  UPDATE: 'finance:pos:update',
  DELETE: 'finance:pos:delete',
  EXPORT: 'finance:pos:export',
  IMPORT: 'finance:pos:import',
} as const;

export type PosPermissionType = typeof POS_PERMISSIONS[keyof typeof POS_PERMISSIONS];
