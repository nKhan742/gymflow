import { StatusType } from '../../../../database/base.model.js';

export interface IBranches {
  id: string;
  _id?: string;
  tenantId: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
