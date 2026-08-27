export const BOOKINGS_PERMISSIONS = {
  VIEW: 'fitness:bookings:view',
  CREATE: 'fitness:bookings:create',
  UPDATE: 'fitness:bookings:update',
  DELETE: 'fitness:bookings:delete',
  EXPORT: 'fitness:bookings:export',
  IMPORT: 'fitness:bookings:import',
} as const;

export type BookingsPermissionType = typeof BOOKINGS_PERMISSIONS[keyof typeof BOOKINGS_PERMISSIONS];
