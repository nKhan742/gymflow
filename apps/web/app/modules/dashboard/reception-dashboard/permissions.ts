export const RECEPTION_DASHBOARD_PERMISSIONS = {
  VIEW: 'dashboard:reception-dashboard:view',
  CREATE: 'dashboard:reception-dashboard:create',
  UPDATE: 'dashboard:reception-dashboard:update',
  DELETE: 'dashboard:reception-dashboard:delete',
  EXPORT: 'dashboard:reception-dashboard:export',
  IMPORT: 'dashboard:reception-dashboard:import',
} as const;

export type ReceptionDashboardPermissionType = typeof RECEPTION_DASHBOARD_PERMISSIONS[keyof typeof RECEPTION_DASHBOARD_PERMISSIONS];
