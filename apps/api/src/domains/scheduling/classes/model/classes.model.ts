import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IClassesModel extends IBaseModel {
  title: string;
  category: 'HIIT' | 'YOGA' | 'SPINNING' | 'BOXING' | 'CROSSFIT' | 'PILATES';
  trainerName: string;
  roomName: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  enrolledCount: number;
  colorHex: string;
  status: StatusType;
}

const classesSchema = new Schema<IClassesModel>(
  {
    ...(baseModelSchemaFields as any),
    title: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['HIIT', 'YOGA', 'SPINNING', 'BOXING', 'CROSSFIT', 'PILATES'],
      required: true,
      index: true,
    },
    trainerName: { type: String, required: true },
    roomName: { type: String, default: 'Studio A' },
    startTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 45 },
    capacity: { type: Number, default: 25 },
    enrolledCount: { type: Number, default: 0 },
    colorHex: { type: String, default: '#8b5cf6' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const ClassesModel = model<IClassesModel>('Classes', classesSchema);

