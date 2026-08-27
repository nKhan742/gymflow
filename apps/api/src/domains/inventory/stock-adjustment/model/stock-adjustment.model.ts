import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IStockAdjustmentModel extends IBaseModel {
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
  metadata?: Record<string, unknown>;
}

const stockAdjustmentSchema = new Schema<IStockAdjustmentModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    adjustmentCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    productId: { type: String },
    productName: { type: String, required: true, index: true },
    sku: { type: String, required: true, index: true },
    adjustmentType: {
      type: String,
      enum: ['INCREASE', 'DECREASE', 'DAMAGE_WRITE_OFF', 'EXPIRED_BATCH', 'THEFT_LOSS', 'CYCLE_COUNT_CORRECTION'],
      default: 'CYCLE_COUNT_CORRECTION',
      index: true,
    },
    previousQuantity: { type: Number, required: true, default: 0 },
    adjustedQuantity: { type: Number, required: true, default: 0 },
    finalQuantity: { type: Number, required: true, default: 0 },
    reason: { type: String, required: true },
    adjustedDate: { type: Date, default: Date.now, index: true },
    adjustedBy: { type: String, default: 'General Manager Chloe Bennett' },
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

export const StockAdjustmentModel = model<IStockAdjustmentModel>('StockAdjustment', stockAdjustmentSchema);
