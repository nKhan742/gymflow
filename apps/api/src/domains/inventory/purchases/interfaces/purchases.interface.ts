import { StatusType } from '../../../../database/base.model.js';

export interface IPurchases {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  purchaseOrderNumber: string;
  supplierId?: string;
  supplierCode: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  itemCount: number;
  items?: Array<{
    description: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  orderStatus: 'RECEIVED' | 'IN_TRANSIT' | 'ORDERED' | 'CANCELLED';
  receivedDate?: Date;
  receivedBy?: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
