import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IProductsModel extends IBaseModel {
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
  metadata?: Record<string, unknown>;
}

const productsSchema = new Schema<IProductsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true, index: true },
    barcode: { type: String, index: true },
    category: {
      type: String,
      enum: ['SUPPLEMENTS', 'BEVERAGES', 'APPAREL', 'ACCESSORIES', 'SNACKS', 'PASSES'],
      default: 'SUPPLEMENTS',
      index: true,
    },
    price: { type: Number, required: true, default: 0 },
    costPrice: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    supplier: { type: String, default: 'Optimum Nutrition HQ' },
    unit: { type: String, default: 'Unit' },
    icon: { type: String, default: '📦' },
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

export const ProductsModel = model<IProductsModel>('Products', productsSchema);
