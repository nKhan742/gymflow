export const MEDICAL_HISTORY_PERMISSIONS = {
  VIEW: 'member-management:medical-history:view',
  CREATE: 'member-management:medical-history:create',
  UPDATE: 'member-management:medical-history:update',
  DELETE: 'member-management:medical-history:delete',
  EXPORT: 'member-management:medical-history:export',
  IMPORT: 'member-management:medical-history:import',
} as const;

export type MedicalHistoryPermissionType = typeof MEDICAL_HISTORY_PERMISSIONS[keyof typeof MEDICAL_HISTORY_PERMISSIONS];
