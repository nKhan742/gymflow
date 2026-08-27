export const DOCUMENTS_PERMISSIONS = {
  VIEW: 'members:documents:view',
  CREATE: 'members:documents:create',
  UPDATE: 'members:documents:update',
  DELETE: 'members:documents:delete',
  EXPORT: 'members:documents:export',
  IMPORT: 'members:documents:import',
} as const;

export type DocumentsPermissionType = typeof DOCUMENTS_PERMISSIONS[keyof typeof DOCUMENTS_PERMISSIONS];
