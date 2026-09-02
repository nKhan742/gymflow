export interface IInventoryReport {
  id: string;
  _id?: string;
  reportTitle: string;
  reportingPeriod: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  startDate: string;
  endDate: string;
  categoryName: string;
  categoryImage?: string;
  totalStockSKUs: number;
  totalUnitsInStock: number;
  totalValuationCost: number;
  totalRetailValue: number;
  cogsSold: number;
  stockTurnoverRatio: number;
  shrinkageRate: number;
  auditedBy: string;
  status: 'AUDITED' | 'VARIANCE_FLAGGED' | 'IN_PROGRESS';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInventoryReportFilters {
  search?: string;
  reportingPeriod?: string;
  status?: string;
  branchId?: string;
}
