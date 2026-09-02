export interface ITrainerReport {
  id: string;
  _id?: string;
  reportTitle: string;
  reportingPeriod: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
  endDate: string;
  trainerName: string;
  trainerAvatar?: string;
  trainerSpecialty: string;
  totalSessionsConducted: number;
  totalHoursRendered: number;
  clientSatisfactionRating: number;
  grossBillingGenerated: number;
  coachCommissionPayout: number;
  facilityNetShare: number;
  auditedBy: string;
  status: 'APPROVED_FOR_PAYROLL' | 'PENDING_REVIEW' | 'FLAGGED';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITrainerReportFilters {
  search?: string;
  reportingPeriod?: string;
  status?: string;
  branchId?: string;
}
