import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IBodyMeasurementsModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  measurementDate: Date;
  unit: 'CM' | 'INCHES';
  chest: number;
  shoulders: number;
  leftArm: number;
  rightArm: number;
  waist: number;
  hips: number;
  leftThigh: number;
  rightThigh: number;
  calves: number;
  waistToHipRatio: number;
  whrCategory: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  measuredBy: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const bodyMeasurementsSchema = new Schema<IBodyMeasurementsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    measurementDate: { type: Date, default: Date.now, index: true },
    unit: { type: String, enum: ['CM', 'INCHES'], default: 'CM' },
    chest: { type: Number, required: true },
    shoulders: { type: Number, default: 110 },
    leftArm: { type: Number, required: true },
    rightArm: { type: Number, required: true },
    waist: { type: Number, required: true },
    hips: { type: Number, required: true },
    leftThigh: { type: Number, required: true },
    rightThigh: { type: Number, required: true },
    calves: { type: Number, default: 36 },
    waistToHipRatio: { type: Number, default: 0.78, index: true },
    whrCategory: {
      type: String,
      enum: ['LOW_RISK', 'MODERATE_RISK', 'HIGH_RISK'],
      default: 'LOW_RISK',
      index: true,
    },
    measuredBy: { type: String, default: 'Coach Alex Vance' },
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

export const BodyMeasurementsModel = model<IBodyMeasurementsModel>('BodyMeasurements', bodyMeasurementsSchema);
