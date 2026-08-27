import { StatusType } from '../../../../database/base.model.js';

export interface IExpenses {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
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
  createdAt: Date;
  updatedAt: Date;
}
