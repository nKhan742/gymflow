import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IMealLibraryModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export const mealLibrarySchema = new Schema<IMealLibraryModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const MealLibraryModel = model<IMealLibraryModel>('MealLibrary', mealLibrarySchema);
