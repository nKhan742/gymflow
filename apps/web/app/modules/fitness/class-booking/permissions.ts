export const CLASS_BOOKING_PERMISSIONS = {
  VIEW: 'fitness:class-booking:view',
  CREATE: 'fitness:class-booking:create',
  UPDATE: 'fitness:class-booking:update',
  DELETE: 'fitness:class-booking:delete',
  EXPORT: 'fitness:class-booking:export',
  IMPORT: 'fitness:class-booking:import',
} as const;

export type ClassBookingPermissionType = typeof CLASS_BOOKING_PERMISSIONS[keyof typeof CLASS_BOOKING_PERMISSIONS];
