import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IExpensesModel extends IBaseModel {
  name: string;
  code?: string;
  voucherCode: string;
  vendorName: string;
  category: 'EQUIPMENT_MAINTENANCE' | 'FACILITY_RENT' | 'UTILITIES_HVAC' | 'INVENTORY_SUPPLIES' | 'MARKETING_ADS' | 'SOFTWARE_SAAS' | 'PETTY_CASH_MISC';
  title: string;
  description?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'CORPORATE_CARD' | 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'PETTY_CASH';
  paymentStatus: 'PAID' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'REJECTED';
  expenseDate: Date;
  dueDate?: Date;
  recordedBy: string;
  approvedBy?: string;
  receiptFileName?: string;
  receiptUrl?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const expensesSchema = new Schema<IExpensesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    voucherCode: { type: String, required: true, unique: true, index: true },
    vendorName: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['EQUIPMENT_MAINTENANCE', 'FACILITY_RENT', 'UTILITIES_HVAC', 'INVENTORY_SUPPLIES', 'MARKETING_ADS', 'SOFTWARE_SAAS', 'PETTY_CASH_MISC'],
      default: 'EQUIPMENT_MAINTENANCE',
      index: true,
    },
    title: { type: String, required: true, index: true },
    description: { type: String },
    amount: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    paymentMethod: {
      type: String,
      enum: ['CORPORATE_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK', 'PETTY_CASH'],
      default: 'CORPORATE_CARD',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING_APPROVAL', 'SCHEDULED', 'REJECTED'],
      default: 'PAID',
      index: true,
    },
    expenseDate: { type: Date, default: Date.now, index: true },
    dueDate: { type: Date },
    recordedBy: { type: String, default: 'Manager Alex Vance' },
    approvedBy: { type: String, default: 'Director Marcus Hayes' },
    receiptFileName: { type: String },
    receiptUrl: { type: String },
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

export const ExpensesModel = model<IExpensesModel>('Expenses', expensesSchema);
