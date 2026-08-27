import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ITaxesModel extends IBaseModel {
  name: string;
  code?: string;
  taxCode: string;
  taxName: string;
  description?: string;
  taxRate: number;
  taxType: 'STANDARD_SALES_TAX' | 'FITNESS_SERVICES_TAX' | 'POS_RETAIL_NUTRITION_TAX' | 'ZERO_RATED_EXEMPT' | 'MUNICIPAL_RECREATION_CESS';
  calculationMethod: 'EXCLUSIVE' | 'INCLUSIVE';
  applicableCategory: 'ALL_MEMBERSHIPS' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_EXEMPT' | 'ALL_SERVICES';
  taxRegistrationNumber: string;
  isDefault: boolean;
  isActive: boolean;
  effectiveFrom: Date;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const taxesSchema = new Schema<ITaxesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    taxCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    taxName: { type: String, required: true, index: true },
    description: { type: String },
    taxRate: { type: Number, required: true, default: 10.0 },
    taxType: {
      type: String,
      enum: ['STANDARD_SALES_TAX', 'FITNESS_SERVICES_TAX', 'POS_RETAIL_NUTRITION_TAX', 'ZERO_RATED_EXEMPT', 'MUNICIPAL_RECREATION_CESS'],
      default: 'STANDARD_SALES_TAX',
      index: true,
    },
    calculationMethod: {
      type: String,
      enum: ['EXCLUSIVE', 'INCLUSIVE'],
      default: 'EXCLUSIVE',
      index: true,
    },
    applicableCategory: {
      type: String,
      enum: ['ALL_MEMBERSHIPS', 'PERSONAL_TRAINING', 'POS_RETAIL', 'STUDENT_EXEMPT', 'ALL_SERVICES'],
      default: 'ALL_MEMBERSHIPS',
      index: true,
    },
    taxRegistrationNumber: { type: String, default: 'EIN-84-9201948' },
    isDefault: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    effectiveFrom: { type: Date, default: Date.now, index: true },
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

export const TaxesModel = model<ITaxesModel>('Taxes', taxesSchema);
