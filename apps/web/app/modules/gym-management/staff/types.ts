import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export type StaffRole =
  | 'TRAINER'
  | 'HEAD_COACH'
  | 'NUTRITIONIST'
  | 'RECEPTIONIST'
  | 'MANAGER'
  | 'MAINTENANCE'
  | 'GROUP_INSTRUCTOR';

export type StaffDepartment =
  | 'FITNESS'
  | 'RECEPTION'
  | 'MANAGEMENT'
  | 'OPERATIONS'
  | 'WELLNESS'
  | string;

export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT' | 'FLEXIBLE';

export interface IStaff extends Partial<IBaseEntity> {
  id?: string;
  _id?: string;
  name: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: StaffRole;
  department: string;
  specializations: string[];
  certifications: string[];
  shift: ShiftType;
  hourlyRate: number;
  salary: number;
  commissionPercentage: number;
  hireDate?: string;
  rating: number;
  reviewsCount: number;
  activeClientsCount: number;
  workingDays?: string[];
  emergencyContact?: IEmergencyContact;
  status: StatusType | 'on_leave';
  branchId?: string;
  branchName?: string;
  metadata?: Record<string, unknown>;
}

export interface IStaffFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
}
