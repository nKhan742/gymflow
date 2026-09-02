import { StatusType } from '../../../../database/base.model.js';

export interface IGymProfile {
  id: string;
  _id?: string;
  tenantId?: string;
  branchId?: string;
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
  status: StatusType;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
