import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IBranchesModel extends IBaseModel {
  name: string;
  code: string;
  tagline?: string;
  image?: string;
  phone?: string;
  email?: string;
  sqFt?: number;
  capacity?: number;
  currentOccupancy?: number;
  memberCount?: number;
  staffCount?: number;
  turnstileCount?: number;
  monthlyRevenue?: number;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  manager?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  operatingHours?: {
    weekdays?: string;
    saturday?: string;
    sunday?: string;
  };
  amenities?: string[];
  status: StatusType;
  metadata?: Record<string, unknown>;
}

export const branchesSchema = new Schema<IBranchesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: '' },
    image: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    sqFt: { type: Number, default: 20000 },
    capacity: { type: Number, default: 350 },
    currentOccupancy: { type: Number, default: 85 },
    memberCount: { type: Number, default: 650 },
    staffCount: { type: Number, default: 18 },
    turnstileCount: { type: Number, default: 2 },
    monthlyRevenue: { type: Number, default: 85000 },
    address: {
      street: { type: String, default: '' },
      suite: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'United States' },
    },
    manager: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    operatingHours: {
      weekdays: { type: String, default: '05:00 AM – 11:00 PM' },
      saturday: { type: String, default: '06:00 AM – 10:00 PM' },
      sunday: { type: String, default: '07:00 AM – 09:00 PM' },
    },
    amenities: { type: [String], default: [] },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const BranchesModel = model<IBranchesModel>('Branches', branchesSchema);
