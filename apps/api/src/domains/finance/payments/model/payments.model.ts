import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IPaymentsModel extends IBaseModel {
  name: string;
  code?: string;
  transactionCode: string;
  invoiceNumber: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  category: 'MEMBERSHIP_RENEWAL' | 'NEW_ENROLLMENT' | 'PERSONAL_TRAINING' | 'LOCKER_RENTAL' | 'POS_RETAIL' | 'DAY_PASS';
  description?: string;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'POS_TERMINAL' | 'CASH' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'UPI_QR';
  paymentGateway: string;
  gatewayTransactionId?: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentDate: Date;
  collectedBy: string;
  receiptUrl?: string;
  notes?: string;
  refundReason?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const paymentsSchema = new Schema<IPaymentsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    transactionCode: { type: String, required: true, unique: true, index: true },
    invoiceNumber: { type: String, required: true, index: true },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    category: {
      type: String,
      enum: ['MEMBERSHIP_RENEWAL', 'NEW_ENROLLMENT', 'PERSONAL_TRAINING', 'LOCKER_RENTAL', 'POS_RETAIL', 'DAY_PASS'],
      default: 'MEMBERSHIP_RENEWAL',
      index: true,
    },
    description: { type: String },
    amount: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    paymentMethod: {
      type: String,
      enum: ['CREDIT_CARD', 'POS_TERMINAL', 'CASH', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'UPI_QR'],
      default: 'CREDIT_CARD',
      index: true,
    },
    paymentGateway: { type: String, default: 'Stripe' },
    gatewayTransactionId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'COMPLETED',
      index: true,
    },
    paymentDate: { type: Date, default: Date.now, index: true },
    collectedBy: { type: String, default: 'Desk Cashier Alex Vance' },
    receiptUrl: { type: String },
    notes: { type: String },
    refundReason: { type: String },
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

export const PaymentsModel = model<IPaymentsModel>('Payments', paymentsSchema);
