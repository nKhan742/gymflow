export const AUDIT_LOGS_PERMISSIONS = {
  VIEW: 'administration:audit-logs:view',
  CREATE: 'administration:audit-logs:create',
  UPDATE: 'administration:audit-logs:update',
  DELETE: 'administration:audit-logs:delete',
  EXPORT: 'administration:audit-logs:export',
  IMPORT: 'administration:audit-logs:import',
} as const;

export type AuditLogsPermissionType = typeof AUDIT_LOGS_PERMISSIONS[keyof typeof AUDIT_LOGS_PERMISSIONS];
