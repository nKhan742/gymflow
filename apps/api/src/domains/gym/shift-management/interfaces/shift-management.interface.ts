export interface IShiftManagement {
  id?: string;
  tenantId?: string;
  name: string;
  code: string;
  departmentId?: string;
  departmentName?: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  breakDurationMins?: number;
  minHeadcount: number;
  daysOfWeek: string[];
  gracePeriodMins?: number;
  overtimeMultiplier?: number;
  color?: string;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'inactive';
  description?: string;
  assignedStaffCount?: number;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
