import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IPurchasesModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  purchaseOrderNumber: string;
  supplierId?: string;
  supplierCode: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  itemCount: number;
  items?: Array<{
    description: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  orderStatus: 'RECEIVED' | 'IN_TRANSIT' | 'ORDERED' | 'CANCELLED';
  receivedDate?: Date;
  receivedBy?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const purchasesSchema = new Schema<IPurchasesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    purchaseOrderNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
    supplierId: { type: String },
    supplierCode: { type: String, required: true, index: true },
    supplierName: { type: String, required: true, index: true },
    orderDate: { type: Date, default: Date.now, index: true },
    expectedDeliveryDate: { type: Date },
    itemCount: { type: Number, default: 1 },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitCost: { type: Number, required: true, default: 0 },
        totalCost: { type: Number, required: true, default: 0 },
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'OVERDUE', 'PARTIAL'],
      default: 'PAID',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['RECEIVED', 'IN_TRANSIT', 'ORDERED', 'CANCELLED'],
      default: 'RECEIVED',
      index: true,
    },
    receivedDate: { type: Date },
    receivedBy: { type: String, default: 'General Manager Chloe Bennett' },
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

export const PurchasesModel = model<IPurchasesModel>('Purchases', purchasesSchema);
