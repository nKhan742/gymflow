export const LEADS_PERMISSIONS = {
  VIEW: 'crm:leads:view',
  CREATE: 'crm:leads:create',
  UPDATE: 'crm:leads:update',
  DELETE: 'crm:leads:delete',
  EXPORT: 'crm:leads:export',
  IMPORT: 'crm:leads:import',
} as const;

export type LeadsPermissionType = typeof LEADS_PERMISSIONS[keyof typeof LEADS_PERMISSIONS];
