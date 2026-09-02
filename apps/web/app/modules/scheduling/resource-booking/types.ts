export interface IResourceBooking {
  id: string;
  _id?: string;
  resourceName: string;
  resourceType: 'COURT' | 'RECOVERY_POD' | 'STUDIO_ROOM' | 'COMBAT_RING' | 'PRIVATE_POD';
  resourcePhoto?: string;
  bookedByMember: string;
  bookedByAvatar?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  hourlyRate: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'VIP_TIER_COMPLIMENTARY';
  status: 'RESERVED' | 'ACTIVE_IN_USE' | 'RELEASED' | 'CANCELED' | 'MAINTENANCE_LOCKOUT';
  zoneLocation: string;
  branchId?: string;
  branchName?: string;
  amenitiesIncluded?: string[];
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IResourceBookingFilters {
  search?: string;
  resourceType?: string;
  status?: string;
  paymentStatus?: string;
  branchId?: string;
}
