import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IFreezeMembershipModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  planTier: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  reason: 'MEDICAL' | 'TRAVEL' | 'WORK_RELOCATION' | 'PERSONAL' | 'PREGNANCY';
  freezeStatus: 'ACTIVE_FROZEN' | 'SCHEDULED' | 'PENDING_APPROVAL' | 'COMPLETED_UNFROZEN' | 'REJECTED';
  feeAmount: number;
  quotaDaysUsed: number;
  maxQuotaDays: number;
  doctorNoteAttached: boolean;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const freezeMembershipSchema = new Schema<IFreezeMembershipModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    memberEmail: { type: String, required: true },
    memberPhone: { type: String, required: true },
    planTier: { type: String, default: 'GOLD_ANNUAL' },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    durationDays: { type: Number, default: 30 },
    reason: {
      type: String,
      enum: ['MEDICAL', 'TRAVEL', 'WORK_RELOCATION', 'PERSONAL', 'PREGNANCY'],
      default: 'MEDICAL',
      index: true,
    },
    freezeStatus: {
      type: String,
      enum: ['ACTIVE_FROZEN', 'SCHEDULED', 'PENDING_APPROVAL', 'COMPLETED_UNFROZEN', 'REJECTED'],
      default: 'ACTIVE_FROZEN',
      index: true,
    },
    feeAmount: { type: Number, default: 0 },
    quotaDaysUsed: { type: Number, default: 30 },
    maxQuotaDays: { type: Number, default: 60 },
    doctorNoteAttached: { type: Boolean, default: false },
    notes: { type: String },
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

export const FreezeMembershipModel = model<IFreezeMembershipModel>('FreezeMembership', freezeMembershipSchema);
