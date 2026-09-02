export interface IDaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface IWorkingHourZone {
  id: string;
  _id?: string;
  name: string;
  code: string;
  zoneType: 'MAIN_GYM' | 'SPA_RECOVERY' | 'SWIMMING_POOL' | 'STUDIO_ROOM' | 'SMOOTHIE_BAR' | 'CHILDCARE';
  is24x7: boolean;
  weeklySchedule: IDaySchedule[];
  peakHoursStart?: string;
  peakHoursEnd?: string;
  maxCapacity?: number;
  maintenanceWindow?: string;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'inactive';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
