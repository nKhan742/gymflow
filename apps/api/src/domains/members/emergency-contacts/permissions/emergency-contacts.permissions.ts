export const EMERGENCY_CONTACTS_PERMISSIONS = {
  VIEW: 'members:emergency-contacts:view',
  CREATE: 'members:emergency-contacts:create',
  UPDATE: 'members:emergency-contacts:update',
  DELETE: 'members:emergency-contacts:delete',
  EXPORT: 'members:emergency-contacts:export',
  IMPORT: 'members:emergency-contacts:import',
} as const;

export type EmergencyContactsPermissionType = typeof EMERGENCY_CONTACTS_PERMISSIONS[keyof typeof EMERGENCY_CONTACTS_PERMISSIONS];
