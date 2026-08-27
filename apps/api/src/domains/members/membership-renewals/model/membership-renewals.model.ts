import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IMembershipRenewalsModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  currentPlan: string;
  currentTier: string;
  expiryDate: Date;
  daysRemaining: number;
  renewalStatus: 'EXPIRED' | 'EXPIRING_CRITICAL' | 'EXPIRING_SOON' | 'RENEWED' | 'AUTO_RENEW_PENDING';
  amount: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod: string;
  lastContactDate?: Date;
  contactChannel?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const membershipRenewalsSchema = new Schema<IMembershipRenewalsModel>(
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
    currentPlan: { type: String, default: 'VIP Platinum All-Access' },
    currentTier: { type: String, default: 'VIP_PLATINUM' },
    expiryDate: { type: Date, required: true, index: true },
    daysRemaining: { type: Number, default: 0, index: true },
    renewalStatus: {
      type: String,
      enum: ['EXPIRED', 'EXPIRING_CRITICAL', 'EXPIRING_SOON', 'RENEWED', 'AUTO_RENEW_PENDING'],
      default: 'EXPIRING_SOON',
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: { type: String, default: 'STRIPE_CARD' },
    lastContactDate: { type: Date },
    contactChannel: { type: String, default: 'EMAIL' },
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

export const MembershipRenewalsModel = model<IMembershipRenewalsModel>('MembershipRenewals', membershipRenewalsSchema);
