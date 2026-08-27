export const EMERGENCY_CONTACTS_PERMISSIONS = {
  VIEW: 'member-management:emergency-contacts:view',
  CREATE: 'member-management:emergency-contacts:create',
  UPDATE: 'member-management:emergency-contacts:update',
  DELETE: 'member-management:emergency-contacts:delete',
  EXPORT: 'member-management:emergency-contacts:export',
  IMPORT: 'member-management:emergency-contacts:import',
} as const;

export type EmergencyContactsPermissionType = typeof EMERGENCY_CONTACTS_PERMISSIONS[keyof typeof EMERGENCY_CONTACTS_PERMISSIONS];
