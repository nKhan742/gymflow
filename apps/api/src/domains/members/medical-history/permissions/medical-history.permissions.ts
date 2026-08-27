export const MEDICAL_HISTORY_PERMISSIONS = {
  VIEW: 'members:medical-history:view',
  CREATE: 'members:medical-history:create',
  UPDATE: 'members:medical-history:update',
  DELETE: 'members:medical-history:delete',
  EXPORT: 'members:medical-history:export',
  IMPORT: 'members:medical-history:import',
} as const;

export type MedicalHistoryPermissionType = typeof MEDICAL_HISTORY_PERMISSIONS[keyof typeof MEDICAL_HISTORY_PERMISSIONS];
