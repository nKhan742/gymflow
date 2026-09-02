export interface IPersonalTrainingPackage {
  id: string;
  _id?: string;
  packageCode: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  memberEmail?: string;
  coachId: string;
  coachName: string;
  packageTier: 'TIER_10_SESSIONS' | 'TIER_20_SESSIONS' | 'TIER_50_SESSIONS' | 'VIP_UNLIMITED';
  totalSessionsPurchased: number;
  sessionsCompleted: number;
  sessionsRemaining: number;
  hourlyRate: number;
  totalPackagePrice: number;
  commissionPercentage: number;
  startDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXHAUSTED' | 'EXPIRED' | 'FROZEN';
  branchId?: string;
  branchName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
