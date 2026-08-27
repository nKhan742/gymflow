import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IBmiModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
  bodyFatPercent: number;
  muscleMassKg: number;
  visceralFat: number;
  bmrKcal: number;
  assessmentDate: Date;
  assessedBy: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const bmiSchema = new Schema<IBmiModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'FEMALE' },
    age: { type: Number, default: 28 },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    bmi: { type: Number, required: true, index: true },
    bmiCategory: {
      type: String,
      enum: ['UNDERWEIGHT', 'NORMAL', 'OVERWEIGHT', 'OBESE'],
      default: 'NORMAL',
      index: true,
    },
    bodyFatPercent: { type: Number, default: 20 },
    muscleMassKg: { type: Number, default: 32 },
    visceralFat: { type: Number, default: 4 },
    bmrKcal: { type: Number, default: 1600 },
    assessmentDate: { type: Date, default: Date.now, index: true },
    assessedBy: { type: String, default: 'Coach Alex Vance' },
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

export const BmiModel = model<IBmiModel>('Bmi', bmiSchema);
