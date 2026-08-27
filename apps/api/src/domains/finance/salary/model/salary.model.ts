import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ISalaryModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  paySlipCode: string;
  staffId?: string;
  staffCode: string;
  staffName: string;
  role: 'HEAD_TRAINER' | 'FITNESS_COACH' | 'GENERAL_MANAGER' | 'FRONT_DESK' | 'NUTRITIONIST' | 'MAINTENANCE';
  payPeriod: string;
  baseSalary: number;
  commissionAmount: number;
  bonusAmount: number;
  deductions: number;
  netSalary: number;
  currency: string;
  paymentMethod: 'DIRECT_DEPOSIT' | 'BANK_TRANSFER' | 'CHECK' | 'CASH';
  bankName: string;
  accountNumber: string;
  disbursementStatus: 'DISBURSED' | 'PROCESSING' | 'ON_HOLD';
  disbursementDate?: Date;
  disbursedBy?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const salarySchema = new Schema<ISalaryModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    paySlipCode: { type: String, required: true, unique: true, index: true },
    staffId: { type: String },
    staffCode: { type: String, required: true, index: true },
    staffName: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ['HEAD_TRAINER', 'FITNESS_COACH', 'GENERAL_MANAGER', 'FRONT_DESK', 'NUTRITIONIST', 'MAINTENANCE'],
      default: 'FITNESS_COACH',
      index: true,
    },
    payPeriod: { type: String, default: 'August 2026', index: true },
    baseSalary: { type: Number, required: true, default: 0 },
    commissionAmount: { type: Number, default: 0 },
    bonusAmount: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    paymentMethod: {
      type: String,
      enum: ['DIRECT_DEPOSIT', 'BANK_TRANSFER', 'CHECK', 'CASH'],
      default: 'DIRECT_DEPOSIT',
      index: true,
    },
    bankName: { type: String, default: 'Chase Bank NA' },
    accountNumber: { type: String, default: '•••• 4829' },
    disbursementStatus: {
      type: String,
      enum: ['DISBURSED', 'PROCESSING', 'ON_HOLD'],
      default: 'DISBURSED',
      index: true,
    },
    disbursementDate: { type: Date, default: Date.now, index: true },
    disbursedBy: { type: String, default: 'Finance Director Marcus Hayes' },
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

export const SalaryModel = model<ISalaryModel>('Salary', salarySchema);
