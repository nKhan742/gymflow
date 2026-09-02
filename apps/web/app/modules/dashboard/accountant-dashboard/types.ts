export interface IInvoiceSettlementItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerAvatar?: string;
  amount: number;
  paymentMethod: 'STRIPE_CARD' | 'POS_CASH' | 'BANK_TRANSFER' | 'APPLE_PAY';
  status: 'SETTLED' | 'OVERDUE' | 'REFUNDED' | 'PENDING';
  dueDate: string;
  taxAmount: number;
}

export interface ICashDrawerRecord {
  registerId: string;
  countedCash: number;
  expectedCash: number;
  variance: number;
  cashierName: string;
  status: 'BALANCED' | 'VARIANCE_FLAGGED';
}

export interface IAccountantDashboardStats {
  totalRevenueMtd: number;
  overdueInvoicesAmount: number;
  dailyPosCashReconciled: number;
  ebitdaMarginPercent: number;
  taxWithheldGst: number;
}
