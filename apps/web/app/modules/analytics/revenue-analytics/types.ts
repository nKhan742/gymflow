export interface IRevenueAnalyticsModel {
  id: string;
  _id?: string;
  modelTitle: string;
  reportingCadence: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  dateRange: string;
  mrrAmount: number;
  arrAmount: number;
  arpuAmount: number;
  cacPaybackMonths: number;
  ltvToCacRatio: number;
  subscriptionYieldPercent: number;
  ptYieldPercent: number;
  posRetailYieldPercent: number;
  analystName: string;
  analystAvatar?: string;
  status: 'VALIDATED' | 'FORECAST_PROJECTION' | 'AUDIT_PENDING';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRevenueAnalyticsModelFilters {
  search?: string;
  reportingCadence?: string;
  status?: string;
  branchId?: string;
}
