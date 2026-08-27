import { StatusType } from '../../../../database/base.model.js';

export interface ISalary {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
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
  createdAt: Date;
  updatedAt: Date;
}
