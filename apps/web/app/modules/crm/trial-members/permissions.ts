export const TRIAL_MEMBERS_PERMISSIONS = {
  VIEW: 'crm:trial-members:view',
  CREATE: 'crm:trial-members:create',
  UPDATE: 'crm:trial-members:update',
  DELETE: 'crm:trial-members:delete',
  EXPORT: 'crm:trial-members:export',
  IMPORT: 'crm:trial-members:import',
} as const;

export type TrialMembersPermissionType = typeof TRIAL_MEMBERS_PERMISSIONS[keyof typeof TRIAL_MEMBERS_PERMISSIONS];
