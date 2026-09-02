export interface IMembershipReport {
  id: string;
  _id?: string;
  reportTitle: string;
  reportingPeriod: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  startDate: string;
  endDate: string;
  activeMembers: number;
  newSignups: number;
  renewals: number;
  cancellations: number;
  frozenMemberships: number;
  retentionRate: number;
  churnRate: number;
  auditedBy: string;
  auditorAvatar?: string;
  status: 'CERTIFIED' | 'PRELIMINARY' | 'AUDIT_IN_PROGRESS';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMembershipReportFilters {
  search?: string;
  reportingPeriod?: string;
  status?: string;
  branchId?: string;
}
