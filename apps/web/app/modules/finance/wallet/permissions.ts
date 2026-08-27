export const WALLET_PERMISSIONS = {
  VIEW: 'finance:wallet:view',
  CREATE: 'finance:wallet:create',
  UPDATE: 'finance:wallet:update',
  DELETE: 'finance:wallet:delete',
  EXPORT: 'finance:wallet:export',
  IMPORT: 'finance:wallet:import',
} as const;

export type WalletPermissionType = typeof WALLET_PERMISSIONS[keyof typeof WALLET_PERMISSIONS];
