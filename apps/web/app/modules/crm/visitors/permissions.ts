export const VISITORS_PERMISSIONS = {
  VIEW: 'crm:visitors:view',
  CREATE: 'crm:visitors:create',
  UPDATE: 'crm:visitors:update',
  DELETE: 'crm:visitors:delete',
  EXPORT: 'crm:visitors:export',
  IMPORT: 'crm:visitors:import',
} as const;

export type VisitorsPermissionType = typeof VISITORS_PERMISSIONS[keyof typeof VISITORS_PERMISSIONS];
