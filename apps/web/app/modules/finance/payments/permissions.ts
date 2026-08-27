export const PAYMENTS_PERMISSIONS = {
  VIEW: 'finance:payments:view',
  CREATE: 'finance:payments:create',
  UPDATE: 'finance:payments:update',
  DELETE: 'finance:payments:delete',
  EXPORT: 'finance:payments:export',
  IMPORT: 'finance:payments:import',
} as const;

export type PaymentsPermissionType = typeof PAYMENTS_PERMISSIONS[keyof typeof PAYMENTS_PERMISSIONS];
