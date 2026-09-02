import { IDaySchedule } from '../model/working-hours.model.js';

export interface IWorkingHours {
  id?: string;
  tenantId?: string;
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
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
