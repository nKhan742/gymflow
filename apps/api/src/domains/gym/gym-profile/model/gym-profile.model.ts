import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IGymProfileModel extends IBaseModel {
  name: string;
  code?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  taxId?: string;
  businessLicense?: string;
  foundedYear?: number;
  currency?: string;
  defaultTaxRate?: number;
  invoiceHeader?: string;
  invoiceFooter?: string;
  is24x7?: boolean;
  maxCapacity?: number;
  currentOccupancy?: number;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  contacts?: {
    phone?: string;
    emergencyPhone?: string;
    email?: string;
    supportEmail?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  operatingHours?: {
    weekdays?: string;
    saturday?: string;
    sunday?: string;
    holidayNotes?: string;
  };
  amenities?: string[];
  zones?: Array<{
    name: string;
    sqFt: number;
    capacity: number;
    description?: string;
  }>;
  accessControl?: {
    turnstileType?: string;
    gateCount?: number;
    aedLocation?: string;
    cctvActive?: boolean;
  };
  metadata?: Record<string, unknown>;
}

export const gymProfileSchema = new Schema<IGymProfileModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    taxId: { type: String, default: '' },
    businessLicense: { type: String, default: '' },
    foundedYear: { type: Number, default: 2020 },
    currency: { type: String, default: 'USD' },
    defaultTaxRate: { type: Number, default: 8.25 },
    invoiceHeader: { type: String, default: '' },
    invoiceFooter: { type: String, default: '' },
    is24x7: { type: Boolean, default: false },
    maxCapacity: { type: Number, default: 450 },
    currentOccupancy: { type: Number, default: 112 },
    address: {
      street: { type: String, default: '' },
      suite: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'United States' },
      latitude: { type: Number, default: 37.7749 },
      longitude: { type: Number, default: -122.4194 },
    },
    contacts: {
      phone: { type: String, default: '' },
      emergencyPhone: { type: String, default: '' },
      email: { type: String, default: '' },
      supportEmail: { type: String, default: '' },
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    operatingHours: {
      weekdays: { type: String, default: '05:00 AM – 11:00 PM' },
      saturday: { type: String, default: '06:00 AM – 10:00 PM' },
      sunday: { type: String, default: '07:00 AM – 09:00 PM' },
      holidayNotes: { type: String, default: 'Closed on Christmas Day & New Year Morning' },
    },
    amenities: { type: [String], default: [] },
    zones: [
      {
        name: { type: String, default: '' },
        sqFt: { type: Number, default: 0 },
        capacity: { type: Number, default: 0 },
        description: { type: String, default: '' },
      },
    ],
    accessControl: {
      turnstileType: { type: String, default: 'Biometric & RFID Smart Turnstiles' },
      gateCount: { type: Number, default: 4 },
      aedLocation: { type: String, default: 'Reception Desk & Level 2 Cardio Zone' },
      cctvActive: { type: Boolean, default: true },
    },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const GymProfileModel = model<IGymProfileModel>('GymProfile', gymProfileSchema);
