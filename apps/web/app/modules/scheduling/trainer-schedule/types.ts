export interface ITrainerSchedule {
  id: string;
  _id?: string;
  trainerName: string;
  trainerPhoto?: string;
  specialty: string;
  shiftType: 'MORNING_OPEN' | 'MID_DAY' | 'EVENING_PEAK' | 'FULL_DAY_WEEKEND';
  shiftHours: string;
  availableDays: string[];
  maxPtClientsPerDay: number;
  bookedPtCount: number;
  hourlyRate: number;
  availabilityStatus: 'AVAILABLE' | 'ON_DUTY_SESSION' | 'ON_BREAK' | 'OFF_DUTY';
  assignedZone: string;
  branchId?: string;
  branchName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITrainerScheduleFilters {
  search?: string;
  shiftType?: string;
  availabilityStatus?: string;
  branchId?: string;
}
