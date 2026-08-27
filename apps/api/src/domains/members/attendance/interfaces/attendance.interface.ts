import { StatusType } from '../../../../database/base.model.js';

export interface IAttendance {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name?: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  checkInTime: Date;
  checkOutTime?: Date;
  durationMinutes?: number;
  method: 'BIOMETRIC_FACE' | 'RFID_KEYCARD' | 'QR_MOBILE' | 'MANUAL_DESK';
  gateLocation: string;
  accessResult: 'GRANTED' | 'DENIED_EXPIRED' | 'DENIED_FROZEN' | 'DENIED_OFF_PEAK';
  turnstileCode: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
