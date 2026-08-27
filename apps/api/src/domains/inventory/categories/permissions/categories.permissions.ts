export const CATEGORIES_PERMISSIONS = {
  VIEW: 'inventory:categories:view',
  CREATE: 'inventory:categories:create',
  UPDATE: 'inventory:categories:update',
  DELETE: 'inventory:categories:delete',
  EXPORT: 'inventory:categories:export',
  IMPORT: 'inventory:categories:import',
} as const;

export type CategoriesPermissionType = typeof CATEGORIES_PERMISSIONS[keyof typeof CATEGORIES_PERMISSIONS];
