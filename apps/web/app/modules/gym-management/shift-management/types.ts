export interface IShift {
  id: string;
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}
