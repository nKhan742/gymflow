import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IShiftManagementModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

const shiftManagementSchema = new Schema<IShiftManagementModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const ShiftManagementModel = model<IShiftManagementModel>('ShiftManagement', shiftManagementSchema);
