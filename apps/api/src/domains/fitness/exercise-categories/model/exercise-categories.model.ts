import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IExerciseCategoriesModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

const exerciseCategoriesSchema = new Schema<IExerciseCategoriesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const ExerciseCategoriesModel = model<IExerciseCategoriesModel>('ExerciseCategories', exerciseCategoriesSchema);
