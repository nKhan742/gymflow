export const DOCUMENTS_PERMISSIONS = {
  VIEW: 'member-management:documents:view',
  CREATE: 'member-management:documents:create',
  UPDATE: 'member-management:documents:update',
  DELETE: 'member-management:documents:delete',
  EXPORT: 'member-management:documents:export',
  IMPORT: 'member-management:documents:import',
} as const;

export type DocumentsPermissionType = typeof DOCUMENTS_PERMISSIONS[keyof typeof DOCUMENTS_PERMISSIONS];
