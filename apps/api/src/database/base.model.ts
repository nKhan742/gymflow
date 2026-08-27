import { Document, Types } from 'mongoose';

export type StatusType = 'active' | 'inactive' | 'pending' | 'suspended' | 'archived';

export interface IBaseModel extends Document {
  _id: Types.ObjectId;
  tenantId: string;
  branchId?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  status: StatusType;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export const baseModelSchemaFields = {
  tenantId: { type: String, required: true, index: true },
  branchId: { type: String, index: true },
  createdBy: { type: String },
  updatedBy: { type: String },
  deletedBy: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended', 'archived'],
    default: 'active',
    index: true,
  },
  isDeleted: { type: Boolean, default: false, index: true },
  version: { type: Number, default: 1 },
};

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false as const,
};
