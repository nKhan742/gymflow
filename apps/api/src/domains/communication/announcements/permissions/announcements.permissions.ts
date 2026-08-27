export const ANNOUNCEMENTS_PERMISSIONS = {
  VIEW: 'communication:announcements:view',
  CREATE: 'communication:announcements:create',
  UPDATE: 'communication:announcements:update',
  DELETE: 'communication:announcements:delete',
  EXPORT: 'communication:announcements:export',
  IMPORT: 'communication:announcements:import',
} as const;

export type AnnouncementsPermissionType = typeof ANNOUNCEMENTS_PERMISSIONS[keyof typeof ANNOUNCEMENTS_PERMISSIONS];
