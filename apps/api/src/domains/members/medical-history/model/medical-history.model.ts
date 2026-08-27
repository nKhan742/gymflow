import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IMedicalHistoryModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  clearanceLevel: 'CLEARANCE_GRANTED' | 'MODIFIED_PROGRAM' | 'PHYSICIAN_CLEARANCE_REQUIRED';
  bloodGroup: string;
  chronicConditions: string[];
  allergies: string[];
  injuriesAndRestrictions: string;
  currentMedications?: string;
  physicianName?: string;
  physicianPhone?: string;
  waiverSigned: boolean;
  lastReviewDate: Date;
  reviewedBy: string;
  emergencyNotes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const medicalHistorySchema = new Schema<IMedicalHistoryModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    clearanceLevel: {
      type: String,
      enum: ['CLEARANCE_GRANTED', 'MODIFIED_PROGRAM', 'PHYSICIAN_CLEARANCE_REQUIRED'],
      default: 'CLEARANCE_GRANTED',
      index: true,
    },
    bloodGroup: { type: String, default: 'O+' },
    chronicConditions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    injuriesAndRestrictions: { type: String, default: 'No known orthopedic restrictions.' },
    currentMedications: { type: String },
    physicianName: { type: String },
    physicianPhone: { type: String },
    waiverSigned: { type: Boolean, default: true },
    lastReviewDate: { type: Date, default: Date.now, index: true },
    reviewedBy: { type: String, default: 'Coach Alex Vance' },
    emergencyNotes: { type: String },
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

export const MedicalHistoryModel = model<IMedicalHistoryModel>('MedicalHistory', medicalHistorySchema);
