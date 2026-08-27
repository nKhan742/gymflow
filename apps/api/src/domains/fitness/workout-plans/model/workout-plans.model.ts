import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IWorkoutPlansModel extends IBaseModel {
  name?: string;
  code?: string;
  title: string;
  description: string;
  goal: 'HYPERTROPHY' | 'FAT_LOSS' | 'STRENGTH' | 'ENDURANCE' | 'ATHLETIC';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationWeeks: number;
  daysPerWeek: number;
  exercisesCount: number;
  trainerName?: string;
  status: StatusType;
}

const workoutPlansSchema = new Schema<IWorkoutPlansModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String },
    code: { type: String },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    goal: {
      type: String,
      enum: ['HYPERTROPHY', 'FAT_LOSS', 'STRENGTH', 'ENDURANCE', 'ATHLETIC'],
      default: 'HYPERTROPHY',
      index: true,
    },
    level: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'INTERMEDIATE',
    },
    durationWeeks: { type: Number, default: 8 },
    daysPerWeek: { type: Number, default: 4 },
    exercisesCount: { type: Number, default: 6 },
    trainerName: { type: String, default: 'Coach Alex Vance' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const WorkoutPlansModel = model<IWorkoutPlansModel>('WorkoutPlans', workoutPlansSchema);
