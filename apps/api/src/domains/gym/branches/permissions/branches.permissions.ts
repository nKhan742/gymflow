export const BRANCHES_PERMISSIONS = {
  VIEW: 'gym:branches:view',
  CREATE: 'gym:branches:create',
  UPDATE: 'gym:branches:update',
  DELETE: 'gym:branches:delete',
  EXPORT: 'gym:branches:export',
  IMPORT: 'gym:branches:import',
} as const;

export type BranchesPermissionType = typeof BRANCHES_PERMISSIONS[keyof typeof BRANCHES_PERMISSIONS];
