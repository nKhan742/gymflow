export const RESOURCE_BOOKING_PERMISSIONS = {
  VIEW: 'scheduling:resource-booking:view',
  CREATE: 'scheduling:resource-booking:create',
  UPDATE: 'scheduling:resource-booking:update',
  DELETE: 'scheduling:resource-booking:delete',
  EXPORT: 'scheduling:resource-booking:export',
  IMPORT: 'scheduling:resource-booking:import',
} as const;

export type ResourceBookingPermissionType = typeof RESOURCE_BOOKING_PERMISSIONS[keyof typeof RESOURCE_BOOKING_PERMISSIONS];
