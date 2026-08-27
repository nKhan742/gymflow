import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IDiscountsModel extends IBaseModel {
  name: string;
  code?: string;
  promoCode: string;
  title: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_TRIAL_PERIOD';
  discountValue: number;
  currency: string;
  applicableDomain: 'ALL_MEMBERSHIPS' | 'ANNUAL_VIP' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_CORPORATE';
  minPurchaseAmount: number;
  maxUsageCount: number;
  usedCount: number;
  startDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdBy?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const discountsSchema = new Schema<IDiscountsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    promoCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_TRIAL_PERIOD'],
      default: 'PERCENTAGE',
      index: true,
    },
    discountValue: { type: Number, required: true, default: 10 },
    currency: { type: String, default: 'USD' },
    applicableDomain: {
      type: String,
      enum: ['ALL_MEMBERSHIPS', 'ANNUAL_VIP', 'PERSONAL_TRAINING', 'POS_RETAIL', 'STUDENT_CORPORATE'],
      default: 'ALL_MEMBERSHIPS',
      index: true,
    },
    minPurchaseAmount: { type: Number, default: 0 },
    maxUsageCount: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now, index: true },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: String, default: 'Marketing Lead Chloe Bennett' },
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

export const DiscountsModel = model<IDiscountsModel>('Discounts', discountsSchema);
