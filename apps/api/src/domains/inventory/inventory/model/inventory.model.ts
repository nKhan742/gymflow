import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IInventoryModel extends IBaseModel {
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
  metadata?: Record<string, unknown>;
}

const inventorySchema = new Schema<IInventoryModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    stockCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    productId: { type: String },
    productName: { type: String, required: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: 'SUPPLEMENTS', index: true },
    quantityOnHand: { type: Number, required: true, default: 0 },
    quantityReserved: { type: Number, default: 0 },
    quantityAvailable: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    reorderQuantity: { type: Number, default: 24 },
    warehouseLocation: { type: String, default: 'Main Stockroom Shelf A-01' },
    lastRestockedDate: { type: Date, default: Date.now },
    stockHealth: {
      type: String,
      enum: ['OPTIMAL', 'LOW_STOCK', 'CRITICAL', 'OUT_OF_STOCK'],
      default: 'OPTIMAL',
      index: true,
    },
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

export const InventoryModel = model<IInventoryModel>('Inventory', inventorySchema);
