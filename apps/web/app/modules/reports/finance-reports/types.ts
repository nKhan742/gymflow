export interface IFinanceReport {
  id: string;
  _id?: string;
  reportTitle: string;
  reportingPeriod: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  startDate: string;
  endDate: string;
  totalRevenue: number;
  operatingExpenses: number;
  payrollExpenses: number;
  facilitiesRentLease: number;
  ebitda: number;
  ebitdaMarginPercentage: number;
  netProfit: number;
  netProfitMarginPercentage: number;
  auditedBy: string;
  auditorAvatar?: string;
  status: 'BOARD_APPROVED' | 'PRELIMINARY' | 'UNDER_AUDIT';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFinanceReportFilters {
  search?: string;
  reportingPeriod?: string;
  status?: string;
  branchId?: string;
}
