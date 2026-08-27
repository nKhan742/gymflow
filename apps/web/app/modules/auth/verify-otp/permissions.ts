export const VERIFY_OTP_PERMISSIONS = {
  VIEW: 'auth:verify-otp:view',
  CREATE: 'auth:verify-otp:create',
  UPDATE: 'auth:verify-otp:update',
  DELETE: 'auth:verify-otp:delete',
  EXPORT: 'auth:verify-otp:export',
  IMPORT: 'auth:verify-otp:import',
} as const;

export type VerifyOtpPermissionType = typeof VERIFY_OTP_PERMISSIONS[keyof typeof VERIFY_OTP_PERMISSIONS];
