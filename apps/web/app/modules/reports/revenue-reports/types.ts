export interface IRevenueReport {
  id: string;
  _id?: string;
  reportTitle: string;
  reportingPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  startDate: string;
  endDate: string;
  grossRevenue: number;
  netRevenue: number;
  membershipRevenue: number;
  ptRevenue: number;
  posRetailRevenue: number;
  amenityRevenue: number;
  refundsDeductions: number;
  growthPercentage: number;
  auditedBy: string;
  auditorAvatar?: string;
  status: 'FINALIZED' | 'DRAFT' | 'AUDIT_PENDING' | 'RECONCILED';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRevenueReportFilters {
  search?: string;
  reportingPeriod?: string;
  status?: string;
  branchId?: string;
}
