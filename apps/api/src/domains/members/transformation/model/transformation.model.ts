import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ITransformationModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  category: 'FAT_LOSS_SHRED' | 'MUSCLE_BUILDING' | 'LIFESTYLE_REHAB' | 'BRIDE_GROOM_PREP';
  title: string;
  durationMonths: number;
  beforeWeightKg: number;
  afterWeightKg: number;
  weightChangeKg: number;
  beforeBodyFat: number;
  afterBodyFat: number;
  bodyFatChange: number;
  waistChangeCm: number;
  beforePhoto?: string;
  afterPhoto?: string;
  story: string;
  coachName: string;
  isFeatured: boolean;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const transformationSchema = new Schema<ITransformationModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    category: {
      type: String,
      enum: ['FAT_LOSS_SHRED', 'MUSCLE_BUILDING', 'LIFESTYLE_REHAB', 'BRIDE_GROOM_PREP'],
      default: 'FAT_LOSS_SHRED',
      index: true,
    },
    title: { type: String, required: true },
    durationMonths: { type: Number, default: 6 },
    beforeWeightKg: { type: Number, required: true },
    afterWeightKg: { type: Number, required: true },
    weightChangeKg: { type: Number, required: true },
    beforeBodyFat: { type: Number, default: 28 },
    afterBodyFat: { type: Number, default: 18 },
    bodyFatChange: { type: Number, default: -10 },
    waistChangeCm: { type: Number, default: -8 },
    beforePhoto: { type: String },
    afterPhoto: { type: String },
    story: { type: String, required: true },
    coachName: { type: String, default: 'Coach Alex Vance' },
    isFeatured: { type: Boolean, default: false, index: true },
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

export const TransformationModel = model<ITransformationModel>('Transformation', transformationSchema);
