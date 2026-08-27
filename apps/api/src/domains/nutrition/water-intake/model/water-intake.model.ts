import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IWaterIntakeModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

const waterIntakeSchema = new Schema<IWaterIntakeModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const WaterIntakeModel = model<IWaterIntakeModel>('WaterIntake', waterIntakeSchema);
