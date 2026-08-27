import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IEmergencyContactsModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  contactName: string;
  relationship: 'SPOUSE' | 'PARENT' | 'SIBLING' | 'PARTNER' | 'GUARDIAN' | 'FRIEND' | 'PHYSICIAN';
  priority: 'PRIMARY' | 'SECONDARY' | 'PHYSICIAN';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isMedicalProxy: boolean;
  preferredHospital?: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  notes?: string;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const emergencyContactsSchema = new Schema<IEmergencyContactsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    description: { type: String },
    memberId: { type: String },
    memberCode: { type: String, required: true, index: true },
    memberName: { type: String, required: true, index: true },
    planTier: { type: String, default: 'VIP_PLATINUM' },
    contactName: { type: String, required: true, index: true },
    relationship: {
      type: String,
      enum: ['SPOUSE', 'PARENT', 'SIBLING', 'PARTNER', 'GUARDIAN', 'FRIEND', 'PHYSICIAN'],
      default: 'SPOUSE',
      index: true,
    },
    priority: {
      type: String,
      enum: ['PRIMARY', 'SECONDARY', 'PHYSICIAN'],
      default: 'PRIMARY',
      index: true,
    },
    phone: { type: String, required: true, index: true },
    alternatePhone: { type: String },
    email: { type: String },
    address: { type: String },
    isMedicalProxy: { type: Boolean, default: true, index: true },
    preferredHospital: { type: String, default: 'City Memorial Hospital' },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'PENDING'],
      default: 'VERIFIED',
      index: true,
    },
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

export const EmergencyContactsModel = model<IEmergencyContactsModel>('EmergencyContacts', emergencyContactsSchema);
