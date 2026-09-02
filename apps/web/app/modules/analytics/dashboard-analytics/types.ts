export interface IDashboardMetricSnapshot {
  id: string;
  _id?: string;
  snapshotTitle: string;
  reportingCadence: 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  dateRecorded: string;
  networkOccupancyRate: number;
  activeMembersCount: number;
  mrrVelocity: number;
  avgWorkoutDwellMinutes: number;
  topPerformingBranch: string;
  systemHealthScore: number;
  recordedBy: string;
  controllerAvatar?: string;
  status: 'ACTIVE_TELEMETRY' | 'ARCHIVED' | 'ANOMALY_DETECTED';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardMetricSnapshotFilters {
  search?: string;
  reportingCadence?: string;
  status?: string;
  branchId?: string;
}
