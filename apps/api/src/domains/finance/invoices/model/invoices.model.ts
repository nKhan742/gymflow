import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IInvoicesModel extends IBaseModel {
  name?: string;
  code?: string;
  description?: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'STRIPE';
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'REFUNDED';
  dueDate: string;
  paidAt?: string;
  status: StatusType;
}

const invoicesSchema = new Schema<IInvoicesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String },
    code: { type: String },
    description: { type: String },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    memberId: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    memberEmail: { type: String, required: true },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: {
      type: String,
      enum: ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'STRIPE'],
      default: 'CREDIT_CARD',
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'OVERDUE', 'REFUNDED'],
      default: 'PAID',
      index: true,
    },
    dueDate: { type: String, default: () => new Date().toISOString() },
    paidAt: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const InvoicesModel = model<IInvoicesModel>('Invoices', invoicesSchema);
