export const BRANCHES_PERMISSIONS = {
  VIEW: 'gym-management:branches:view',
  CREATE: 'gym-management:branches:create',
  UPDATE: 'gym-management:branches:update',
  DELETE: 'gym-management:branches:delete',
  EXPORT: 'gym-management:branches:export',
  IMPORT: 'gym-management:branches:import',
} as const;

export type BranchesPermissionType = typeof BRANCHES_PERMISSIONS[keyof typeof BRANCHES_PERMISSIONS];
