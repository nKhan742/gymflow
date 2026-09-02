import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IMemberMembership {
  planId: string;
  planName: string;
  tier: 'VIP_PLATINUM' | 'GOLD_ANNUAL' | 'SILVER_MONTHLY' | 'STANDARD';
  startDate: string;
  endDate: string;
  price: number;
  status: 'ACTIVE' | 'EXPIRED' | 'FROZEN' | 'PENDING';
  autoRenew: boolean;
}

export interface IMemberTrainer {
  trainerId?: string;
  name?: string;
  email?: string;
}

export interface IMemberEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface IMemberStats {
  totalVisits: number;
  visitsThisMonth: number;
  lastVisit?: string;
  streakDays: number;
}

export interface IMembersModel extends IBaseModel {
  memberCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  avatar?: string;
  membership: IMemberMembership;
  assignedTrainer?: IMemberTrainer;
  emergencyContact?: IMemberEmergencyContact;
  rfidCardNumber?: string;
  biometricId?: string;
  lockerNumber?: string;
  status: StatusType;
  memberStatus: 'ACTIVE' | 'EXPIRED' | 'FROZEN' | 'OVERDUE' | 'PENDING';
  stats: IMemberStats;
  notes?: string;
}

const membersSchema = new Schema<IMembersModel>(
  {
    ...(baseModelSchemaFields as any),
    memberCode: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'OTHER' },
    dateOfBirth: { type: String },
    avatar: { type: String },
    membership: {
      planId: { type: String, default: 'plan_gold' },
      planName: { type: String, default: 'Gold Annual All-Access' },
      tier: { type: String, enum: ['VIP_PLATINUM', 'GOLD_ANNUAL', 'SILVER_MONTHLY', 'STANDARD'], default: 'GOLD_ANNUAL' },
      startDate: { type: String, default: () => new Date().toISOString() },
      endDate: { type: String, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
      price: { type: Number, default: 899 },
      status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'FROZEN', 'PENDING'], default: 'ACTIVE' },
      autoRenew: { type: Boolean, default: true },
    },
    assignedTrainer: {
      trainerId: { type: String },
      name: { type: String },
      email: { type: String },
    },
    emergencyContact: {
      name: { type: String, default: 'N/A' },
      relationship: { type: String, default: 'Family' },
      phone: { type: String, default: 'N/A' },
    },
    rfidCardNumber: { type: String },
    biometricId: { type: String },
    lockerNumber: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
    memberStatus: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'FROZEN', 'OVERDUE', 'PENDING'],
      default: 'ACTIVE',
      index: true,
    },
    stats: {
      totalVisits: { type: Number, default: 0 },
      visitsThisMonth: { type: Number, default: 0 },
      lastVisit: { type: String },
      streakDays: { type: Number, default: 0 },
    },
    notes: { type: String },
  },
  baseSchemaOptions
);

export const MembersModel = model<IMembersModel>('Members', membersSchema);
export { membersSchema };
