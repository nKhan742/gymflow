export interface ITrainerAnalyticsModel {
  id: string;
  _id?: string;
  trainerName: string;
  trainerAvatar?: string;
  coachingSpecialty: string;
  reportingPeriod: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  ptHoursRendered: number;
  trainerFloorUtilizationRate: number;
  grossPtRevenueYield: number;
  clientRetentionRate: number;
  netPromoterScore: number;
  performanceTier: 'ELITE_MASTER' | 'SENIOR_PERFORMANCE' | 'PRO_COACH';
  status: 'ACTIVE_ROSTER' | 'ON_LEAVE' | 'AUDIT_FLAG';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITrainerAnalyticsModelFilters {
  search?: string;
  reportingPeriod?: string;
  performanceTier?: string;
  status?: string;
  branchId?: string;
}
