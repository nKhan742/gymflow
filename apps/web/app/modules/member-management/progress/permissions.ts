export const PROGRESS_PERMISSIONS = {
  VIEW: 'member-management:progress:view',
  CREATE: 'member-management:progress:create',
  UPDATE: 'member-management:progress:update',
  DELETE: 'member-management:progress:delete',
  EXPORT: 'member-management:progress:export',
  IMPORT: 'member-management:progress:import',
} as const;

export type ProgressPermissionType = typeof PROGRESS_PERMISSIONS[keyof typeof PROGRESS_PERMISSIONS];
