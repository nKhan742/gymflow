import { StatusType } from '../../../../database/base.model.js';

export interface IProducts {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: 'SUPPLEMENTS' | 'BEVERAGES' | 'APPAREL' | 'ACCESSORIES' | 'SNACKS' | 'PASSES';
  price: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  supplier: string;
  unit: string;
  icon?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
