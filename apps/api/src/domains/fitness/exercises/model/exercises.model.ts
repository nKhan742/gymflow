import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IExercisesModel extends IBaseModel {
  name: string;
  category: 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'CARDIO';
  targetMuscles: string[];
  equipmentRequired: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  videoUrl?: string;
  instructions: string[];
  status: StatusType;
}

const exercisesSchema = new Schema<IExercisesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'CARDIO'],
      required: true,
      index: true,
    },
    targetMuscles: [{ type: String }],
    equipmentRequired: { type: String, default: 'Barbell' },
    difficulty: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'INTERMEDIATE',
    },
    videoUrl: { type: String },
    instructions: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const ExercisesModel = model<IExercisesModel>('Exercises', exercisesSchema);

