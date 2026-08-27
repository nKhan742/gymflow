import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ICategoriesModel extends IBaseModel {
  name: string;
  code?: string;
  categoryCode: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
  taxRate: number;
  isDisplayedInPOS: boolean;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const categoriesSchema = new Schema<ICategoriesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    categoryCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    icon: { type: String, default: '📦' },
    productCount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 10 },
    isDisplayedInPOS: { type: Boolean, default: true, index: true },
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

export const CategoriesModel = model<ICategoriesModel>('Categories', categoriesSchema);
