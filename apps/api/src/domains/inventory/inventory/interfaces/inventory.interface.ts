import { StatusType } from '../../../../database/base.model.js';

export interface IInventory {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  stockCode: string;
  productId?: string;
  productName: string;
  sku: string;
  category: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderLevel: number;
  reorderQuantity: number;
  warehouseLocation: string;
  lastRestockedDate?: Date;
  stockHealth: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK';
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
