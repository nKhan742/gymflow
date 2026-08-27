export const GROUP_CLASSES_PERMISSIONS = {
  VIEW: 'fitness:group-classes:view',
  CREATE: 'fitness:group-classes:create',
  UPDATE: 'fitness:group-classes:update',
  DELETE: 'fitness:group-classes:delete',
  EXPORT: 'fitness:group-classes:export',
  IMPORT: 'fitness:group-classes:import',
} as const;

export type GroupClassesPermissionType = typeof GROUP_CLASSES_PERMISSIONS[keyof typeof GROUP_CLASSES_PERMISSIONS];
