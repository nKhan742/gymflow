export const CAMPAIGNS_PERMISSIONS = {
  VIEW: 'crm:campaigns:view',
  CREATE: 'crm:campaigns:create',
  UPDATE: 'crm:campaigns:update',
  DELETE: 'crm:campaigns:delete',
  EXPORT: 'crm:campaigns:export',
  IMPORT: 'crm:campaigns:import',
} as const;

export type CampaignsPermissionType = typeof CAMPAIGNS_PERMISSIONS[keyof typeof CAMPAIGNS_PERMISSIONS];
