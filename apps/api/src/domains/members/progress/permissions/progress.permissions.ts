export const PROGRESS_PERMISSIONS = {
  VIEW: 'members:progress:view',
  CREATE: 'members:progress:create',
  UPDATE: 'members:progress:update',
  DELETE: 'members:progress:delete',
  EXPORT: 'members:progress:export',
  IMPORT: 'members:progress:import',
} as const;

export type ProgressPermissionType = typeof PROGRESS_PERMISSIONS[keyof typeof PROGRESS_PERMISSIONS];
