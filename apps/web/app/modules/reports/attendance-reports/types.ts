export interface IAttendanceReport {
  id: string;
  _id?: string;
  reportTitle: string;
  reportingPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  startDate: string;
  endDate: string;
  totalCheckIns: number;
  uniqueMembers: number;
  peakHour: string;
  peakHeadcount: number;
  averageDurationMinutes: number;
  groupClassAttendance: number;
  turnstileScanPassRate: number;
  auditedBy: string;
  auditorAvatar?: string;
  status: 'COMPILED' | 'VERIFIED' | 'PROCESSING';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceReportFilters {
  search?: string;
  reportingPeriod?: string;
  status?: string;
  branchId?: string;
}
