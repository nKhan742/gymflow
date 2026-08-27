import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ITrainerCommissionModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  commissionCode: string;
  trainerId?: string;
  trainerCode: string;
  trainerName: string;
  role: string;
  clientMemberCode?: string;
  clientMemberName?: string;
  commissionType: '1_ON_1_PERSONAL_TRAINING' | 'GROUP_FITNESS_CLASS' | 'PACKAGE_SALES_COMMISSION' | 'NUTRITION_MEAL_PLAN' | 'MONTHLY_RETENTION_BONUS';
  sessionTitle: string;
  billedAmount: number;
  commissionRate: number;
  commissionEarned: number;
  currency: string;
  sessionCount: number;
  sessionDate: Date;
  payoutStatus: 'SETTLED' | 'PENDING_PAYOUT' | 'IN_AUDIT';
  payoutDate?: Date;
  approvedBy?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const trainerCommissionSchema = new Schema<ITrainerCommissionModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    commissionCode: { type: String, required: true, unique: true, index: true },
    trainerId: { type: String },
    trainerCode: { type: String, required: true, index: true },
    trainerName: { type: String, required: true, index: true },
    role: { type: String, default: 'HEAD_TRAINER' },
    clientMemberCode: { type: String, index: true },
    clientMemberName: { type: String },
    commissionType: {
      type: String,
      enum: ['1_ON_1_PERSONAL_TRAINING', 'GROUP_FITNESS_CLASS', 'PACKAGE_SALES_COMMISSION', 'NUTRITION_MEAL_PLAN', 'MONTHLY_RETENTION_BONUS'],
      default: '1_ON_1_PERSONAL_TRAINING',
      index: true,
    },
    sessionTitle: { type: String, required: true, index: true },
    billedAmount: { type: Number, required: true, default: 0 },
    commissionRate: { type: Number, required: true, default: 50 },
    commissionEarned: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    sessionCount: { type: Number, default: 1 },
    sessionDate: { type: Date, default: Date.now, index: true },
    payoutStatus: {
      type: String,
      enum: ['SETTLED', 'PENDING_PAYOUT', 'IN_AUDIT'],
      default: 'SETTLED',
      index: true,
    },
    payoutDate: { type: Date },
    approvedBy: { type: String, default: 'General Manager Chloe Bennett' },
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

export const TrainerCommissionModel = model<ITrainerCommissionModel>('TrainerCommission', trainerCommissionSchema);
