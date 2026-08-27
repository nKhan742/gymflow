import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IAttendanceModel extends IBaseModel {
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
  metadata?: Record<string, unknown>;
}

const attendanceSchema = new Schema<IAttendanceModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, default: 'Turnstile Check-In' },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    checkInTime: { type: Date, default: Date.now, index: true },
    checkOutTime: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    method: {
      type: String,
      enum: ['BIOMETRIC_FACE', 'RFID_KEYCARD', 'QR_MOBILE', 'MANUAL_DESK'],
      default: 'BIOMETRIC_FACE',
      index: true,
    },
    gateLocation: { type: String, default: 'Gate A - Main Turnstile #1' },
    accessResult: {
      type: String,
      enum: ['GRANTED', 'DENIED_EXPIRED', 'DENIED_FROZEN', 'DENIED_OFF_PEAK'],
      default: 'GRANTED',
      index: true,
    },
    turnstileCode: { type: String, default: 'TRN-01' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const AttendanceModel = model<IAttendanceModel>('Attendance', attendanceSchema);
