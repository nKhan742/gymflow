import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';
import { IEmergencyContact } from '../interfaces/staff.interface.js';

export interface IStaffModel extends IBaseModel {
  name: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: 'TRAINER' | 'HEAD_COACH' | 'NUTRITIONIST' | 'RECEPTIONIST' | 'MANAGER' | 'MAINTENANCE' | 'GROUP_INSTRUCTOR';
  department: 'FITNESS' | 'RECEPTION' | 'MANAGEMENT' | 'OPERATIONS' | 'WELLNESS';
  specializations: string[];
  certifications: string[];
  shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'FLEXIBLE';
  hourlyRate: number;
  salary: number;
  commissionPercentage: number;
  hireDate: string;
  rating: number;
  reviewsCount: number;
  activeClientsCount: number;
  workingDays: string[];
  emergencyContact?: IEmergencyContact;
  status: StatusType;
  metadata?: Record<string, unknown>;
}

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: { type: String, default: '' },
    relationship: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { _id: false }
);

const staffSchema = new Schema<IStaffModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: {
      type: String,
      enum: ['TRAINER', 'HEAD_COACH', 'NUTRITIONIST', 'RECEPTIONIST', 'MANAGER', 'MAINTENANCE', 'GROUP_INSTRUCTOR'],
      default: 'TRAINER',
      index: true,
    },
    department: {
      type: String,
      enum: ['FITNESS', 'RECEPTION', 'MANAGEMENT', 'OPERATIONS', 'WELLNESS'],
      default: 'FITNESS',
      index: true,
    },
    specializations: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    shift: {
      type: String,
      enum: ['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE'],
      default: 'MORNING',
      index: true,
    },
    hourlyRate: { type: Number, default: 45 },
    salary: { type: Number, default: 60000 },
    commissionPercentage: { type: Number, default: 20 },
    hireDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    activeClientsCount: { type: Number, default: 0 },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    emergencyContact: { type: emergencyContactSchema },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'suspended', 'archived'],
      default: 'active',
      index: true,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const StaffModel = model<IStaffModel>('Staff', staffSchema);
export { staffSchema };
