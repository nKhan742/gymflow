import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ISuppliersModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  supplierCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  categoriesSupplied: string;
  paymentTerms: 'NET_30' | 'NET_15' | 'NET_60' | 'PREPAID' | 'COD';
  rating: number;
  totalOrdersPlaced: number;
  totalSpend: number;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const suppliersSchema = new Schema<ISuppliersModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    supplierCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    companyName: { type: String, required: true, index: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    address: { type: String },
    categoriesSupplied: { type: String, default: 'Supplements' },
    paymentTerms: {
      type: String,
      enum: ['NET_30', 'NET_15', 'NET_60', 'PREPAID', 'COD'],
      default: 'NET_30',
      index: true,
    },
    rating: { type: Number, default: 5.0 },
    totalOrdersPlaced: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
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

export const SuppliersModel = model<ISuppliersModel>('Suppliers', suppliersSchema);
