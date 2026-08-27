import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IWalletModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  walletCode: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  currentBalance: number;
  lifetimeDeposited: number;
  lifetimeSpent: number;
  rewardPoints: number;
  currency: string;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold?: number;
  autoTopUpAmount?: number;
  lastTransactionDate?: Date;
  lastTransactionType?: 'TOP_UP_DEPOSIT' | 'CAFE_POS_DEBIT' | 'SESSION_DEBIT' | 'CASHBACK_REWARD' | 'REFUND_CREDIT';
  lastTransactionAmount?: number;
  walletStatus: 'ACTIVE' | 'LOW_BALANCE' | 'FROZEN';
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const walletSchema = new Schema<IWalletModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    walletCode: { type: String, required: true, unique: true, index: true },
    memberId: { type: String },
    memberCode: { type: String, required: true, unique: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    currentBalance: { type: Number, required: true, default: 0 },
    lifetimeDeposited: { type: Number, default: 0 },
    lifetimeSpent: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    autoTopUpEnabled: { type: Boolean, default: false },
    autoTopUpThreshold: { type: Number, default: 20 },
    autoTopUpAmount: { type: Number, default: 100 },
    lastTransactionDate: { type: Date, default: Date.now },
    lastTransactionType: {
      type: String,
      enum: ['TOP_UP_DEPOSIT', 'CAFE_POS_DEBIT', 'SESSION_DEBIT', 'CASHBACK_REWARD', 'REFUND_CREDIT'],
      default: 'TOP_UP_DEPOSIT',
    },
    lastTransactionAmount: { type: Number, default: 0 },
    walletStatus: {
      type: String,
      enum: ['ACTIVE', 'LOW_BALANCE', 'FROZEN'],
      default: 'ACTIVE',
      index: true,
    },
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

export const WalletModel = model<IWalletModel>('Wallet', walletSchema);
