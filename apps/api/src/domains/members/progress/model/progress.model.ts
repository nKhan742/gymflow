import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IProgressModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  primaryGoal: 'FAT_LOSS' | 'STRENGTH_HYPERTROPHY' | 'ENDURANCE' | 'REHAB_MOBILITY' | 'GENERAL_FITNESS';
  goalTitle: string;
  targetDate: Date;
  progressPercent: number;
  milestonesCompleted: number;
  totalMilestones: number;
  benchPressKg: number;
  squatKg: number;
  deadliftKg: number;
  adherencePercent: number;
  progressStatus: 'ON_TRACK' | 'ATTENTION_NEEDED' | 'GOAL_ACHIEVED';
  assignedCoach: string;
  coachFeedback?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const progressSchema = new Schema<IProgressModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    primaryGoal: {
      type: String,
      enum: ['FAT_LOSS', 'STRENGTH_HYPERTROPHY', 'ENDURANCE', 'REHAB_MOBILITY', 'GENERAL_FITNESS'],
      default: 'STRENGTH_HYPERTROPHY',
      index: true,
    },
    goalTitle: { type: String, default: '12-Week Lean Hypertrophy Block' },
    targetDate: { type: Date, required: true, index: true },
    progressPercent: { type: Number, default: 50, index: true },
    milestonesCompleted: { type: Number, default: 3 },
    totalMilestones: { type: Number, default: 5 },
    benchPressKg: { type: Number, default: 75 },
    squatKg: { type: Number, default: 110 },
    deadliftKg: { type: Number, default: 130 },
    adherencePercent: { type: Number, default: 90 },
    progressStatus: {
      type: String,
      enum: ['ON_TRACK', 'ATTENTION_NEEDED', 'GOAL_ACHIEVED'],
      default: 'ON_TRACK',
      index: true,
    },
    assignedCoach: { type: String, default: 'Coach Alex Vance' },
    coachFeedback: { type: String },
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

export const ProgressModel = model<IProgressModel>('Progress', progressSchema);
