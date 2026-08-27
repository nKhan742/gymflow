export const TRAINER_COMMISSION_PERMISSIONS = {
  VIEW: 'finance:trainer-commission:view',
  CREATE: 'finance:trainer-commission:create',
  UPDATE: 'finance:trainer-commission:update',
  DELETE: 'finance:trainer-commission:delete',
  EXPORT: 'finance:trainer-commission:export',
  IMPORT: 'finance:trainer-commission:import',
} as const;

export type TrainerCommissionPermissionType = typeof TRAINER_COMMISSION_PERMISSIONS[keyof typeof TRAINER_COMMISSION_PERMISSIONS];
