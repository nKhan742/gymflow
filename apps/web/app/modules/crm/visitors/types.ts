export interface IVisitor {
  id: string;
  _id?: string;
  visitorName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  badgeNumber: string;
  visitDate: string;
  checkInTime: string;
  checkOutTime?: string;
  purpose: 'CAMPUS_TOUR' | 'PERSONAL_TRAINING_INTRO' | 'DAY_PASS_WORKOUT' | 'VENDOR_MEETING' | 'VIP_EXPERIENCE';
  hostStaff: string;
  branchId?: string;
  branchName?: string;
  waiverSigned: boolean;
  status: 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IVisitors = IVisitor;

export interface IVisitorFilters {
  search?: string;
  status?: string;
  purpose?: string;
  branchId?: string;
}
