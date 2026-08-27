import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IProductsModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  sku: string;
  category: 'SUPPLEMENTS' | 'BEVERAGES' | 'APPAREL' | 'ACCESSORIES' | 'SNACKS';
  price: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  supplier: string;
  status: StatusType;
}

const productsSchema = new Schema<IProductsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String },
    description: { type: String },
    sku: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ['SUPPLEMENTS', 'BEVERAGES', 'APPAREL', 'ACCESSORIES', 'SNACKS'],
      default: 'SUPPLEMENTS',
      index: true,
    },
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    supplier: { type: String, default: 'Optimum Nutrition HQ' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const ProductsModel = model<IProductsModel>('Products', productsSchema);
