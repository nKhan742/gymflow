import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IDocumentsModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  documentType: 'MEMBERSHIP_CONTRACT' | 'LIABILITY_WAIVER' | 'GOVERNMENT_ID' | 'MEDICAL_CLEARANCE' | 'CORPORATE_STUDENT_PROOF' | 'PAYMENT_RECEIPT';
  title: string;
  fileName: string;
  fileSize: string;
  fileFormat: string;
  fileUrl?: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'EXPIRED' | 'REJECTED';
  uploadDate: Date;
  expiryDate?: Date;
  verifiedBy?: string;
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const documentsSchema = new Schema<IDocumentsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    documentType: {
      type: String,
      enum: ['MEMBERSHIP_CONTRACT', 'LIABILITY_WAIVER', 'GOVERNMENT_ID', 'MEDICAL_CLEARANCE', 'CORPORATE_STUDENT_PROOF', 'PAYMENT_RECEIPT'],
      default: 'MEMBERSHIP_CONTRACT',
      index: true,
    },
    title: { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    fileSize: { type: String, default: '1.8 MB' },
    fileFormat: { type: String, default: 'PDF' },
    fileUrl: { type: String },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'PENDING_REVIEW', 'EXPIRED', 'REJECTED'],
      default: 'VERIFIED',
      index: true,
    },
    uploadDate: { type: Date, default: Date.now, index: true },
    expiryDate: { type: Date },
    verifiedBy: { type: String, default: 'Manager Alex Vance' },
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

export const DocumentsModel = model<IDocumentsModel>('Documents', documentsSchema);
