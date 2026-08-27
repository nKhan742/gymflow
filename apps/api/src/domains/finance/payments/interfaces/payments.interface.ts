import { StatusType } from '../../../../database/base.model.js';

export interface IPayments {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
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
  createdAt: Date;
  updatedAt: Date;
}
