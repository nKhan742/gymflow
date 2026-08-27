import { StatusType } from '../../../../database/base.model.js';

export interface IStockAdjustment {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  adjustmentCode: string;
  productId?: string;
  productName: string;
  sku: string;
  adjustmentType: 'INCREASE' | 'DECREASE' | 'DAMAGE_WRITE_OFF' | 'EXPIRED_BATCH' | 'THEFT_LOSS' | 'CYCLE_COUNT_CORRECTION';
  previousQuantity: number;
  adjustedQuantity: number;
  finalQuantity: number;
  reason: string;
  adjustedDate: Date;
  adjustedBy: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
