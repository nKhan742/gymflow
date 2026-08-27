import { StatusType } from '../../../../database/base.model.js';

export interface IInvoices {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
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
  createdAt: Date;
  updatedAt: Date;
}
