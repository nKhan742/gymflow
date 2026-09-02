export interface ILiveCheckinEvent {
  id: string;
  memberCode: string;
  memberName: string;
  memberAvatar?: string;
  membershipPlan: string;
  gateName: string;
  status: 'ACCESS_GRANTED' | 'FROZEN_CONTRACT' | 'PAYMENT_DUE' | 'FLAGGED_KYC';
  timestamp: string;
  notes?: string;
}

export interface ITodayStudioClass {
  id: string;
  className: string;
  trainerName: string;
  trainerAvatar?: string;
  timeSlot: string;
  roomStudio: string;
  enrolledCount: number;
  maxCapacity: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface IVisitorEntry {
  id: string;
  visitorName: string;
  visitorPhone: string;
  purpose: 'VIP_TRIAL' | 'FACILITY_TOUR' | 'GUEST_PASS' | 'MEETING';
  hostStaff: string;
  checkinTime: string;
  status: 'CHECKED_IN' | 'COMPLETED';
}

export interface IReceptionDashboardStats {
  todayEntriesCount: number;
  turnstileGateStatus: 'ONLINE_ACTIVE' | 'DEGRADED' | 'MAINTENANCE';
  posDrawerBalance: number;
  pendingTrialPasses: number;
  liveFacilityOccupancy: number;
  maxCapacity: number;
}
