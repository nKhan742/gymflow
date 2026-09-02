export interface ITrialMember {
  id: string;
  _id?: string;
  guestName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  passCode: string;
  passType: '1_DAY_PASS' | '3_DAY_TRIAL' | '7_DAY_EXPERIENCE' | 'WEEKEND_WARRIOR';
  startDate: string;
  endDate: string;
  maxAllowedCheckIns: number;
  checkInCount: number;
  sponsorTrainer: string;
  branchId?: string;
  branchName?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CONVERTED' | 'CANCELLED';
  amenitiesIncluded: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ITrialMembers = ITrialMember;

export interface ITrialMemberFilters {
  search?: string;
  status?: string;
  passType?: string;
  branchId?: string;
}
