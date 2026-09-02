import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IMembershipPlansModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  tier: 'VIP_PLATINUM' | 'GOLD_ANNUAL' | 'SILVER_MONTHLY' | 'STUDENT_CORPORATE' | 'OFF_PEAK' | 'CLASS_PACK';
  price: number;
  currency: string;
  billingCycle: 'ANNUAL' | 'MONTHLY' | 'QUARTERLY' | 'PACK';
  initiationFee: number;
  accessHours: string;
  multiBranch: boolean;
  inclusions: string[];
  maxFreezeDays: number;
  popular?: boolean;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

export const membershipPlansSchema = new Schema<IMembershipPlansModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    tier: {
      type: String,
      enum: ['VIP_PLATINUM', 'GOLD_ANNUAL', 'SILVER_MONTHLY', 'STUDENT_CORPORATE', 'OFF_PEAK', 'CLASS_PACK'],
      default: 'GOLD_ANNUAL',
      index: true,
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    billingCycle: {
      type: String,
      enum: ['ANNUAL', 'MONTHLY', 'QUARTERLY', 'PACK'],
      default: 'ANNUAL',
    },
    initiationFee: { type: Number, default: 0 },
    accessHours: { type: String, default: '24/7 All-Access' },
    multiBranch: { type: Boolean, default: false },
    inclusions: [{ type: String }],
    maxFreezeDays: { type: Number, default: 30 },
    popular: { type: Boolean, default: false },
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

export const MembershipPlansModel = model<IMembershipPlansModel>('MembershipPlans', membershipPlansSchema);
