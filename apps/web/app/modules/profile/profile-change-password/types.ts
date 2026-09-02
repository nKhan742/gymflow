export interface ISecurityCredentialModel {
  id: string;
  _id?: string;
  accountEmail: string;
  accountHolderName: string;
  accountHolderAvatar?: string;
  passwordAgeDays: number;
  lastRotationDate: string;
  passwordStrengthScore: number;
  mfaEnabled: boolean;
  mfaMethod: 'AUTHENTICATOR_APP' | 'SMS_OTP' | 'HARDWARE_KEY_FIDO2';
  activeSessionCount: number;
  ipAddressLastLogin: string;
  sessionDevice: string;
  forceRotationDays: number;
  securityHealthScore: number;
  status: 'COMPLIANT' | 'ROTATION_DUE' | 'LOCKOUT_FLAG';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISecurityCredentialModelFilters {
  search?: string;
  mfaMethod?: string;
  status?: string;
  branchId?: string;
}
