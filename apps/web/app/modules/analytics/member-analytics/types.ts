export interface IMemberAnalyticsModel {
  id: string;
  _id?: string;
  cohortTitle: string;
  cohortPeriod: 'MONTHLY_COHORT' | 'QUARTERLY_CENSUS' | 'ANNUAL_LIFECYCLE';
  cohortDate: string;
  activeEnrolledAthletes: number;
  cohortRetentionRate: number;
  churnHazardRate: number;
  avgVisitsPerWeek: number;
  atRiskMembersCount: number;
  memberEngagementScore: number;
  cxAnalyst: string;
  analystAvatar?: string;
  status: 'HEALTHY_ENGAGEMENT' | 'CHURN_ALERT' | 'CAMPAIGN_TRIGGERED';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMemberAnalyticsModelFilters {
  search?: string;
  cohortPeriod?: string;
  status?: string;
  branchId?: string;
}
