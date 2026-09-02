export interface IAttendanceAnalyticsModel {
  id: string;
  _id?: string;
  analysisTitle: string;
  analysisPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  analysisDate: string;
  totalTurnstileThroughput: number;
  peakRushHourWindow: string;
  peakFloorHeadcount: number;
  avgWorkoutDurationMinutes: number;
  studioClassCapacityUtilization: number;
  biometricNfcScanSuccessRate: number;
  operationsAnalyst: string;
  analystAvatar?: string;
  status: 'NORMAL_OPERATIONS' | 'PEAK_SURGE' | 'EQUIPMENT_LOCKOUT';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceAnalyticsModelFilters {
  search?: string;
  analysisPeriod?: string;
  status?: string;
  branchId?: string;
}
