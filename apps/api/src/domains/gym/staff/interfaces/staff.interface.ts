import { StatusType } from '../../../../database/base.model.js';

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface IStaff {
  id: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: 'TRAINER' | 'HEAD_COACH' | 'NUTRITIONIST' | 'RECEPTIONIST' | 'MANAGER' | 'MAINTENANCE' | 'GROUP_INSTRUCTOR';
  department: string;
  specializations: string[];
  certifications: string[];
  shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'FLEXIBLE';
  hourlyRate: number;
  salary: number;
  commissionPercentage: number;
  hireDate: string;
  rating: number;
  reviewsCount: number;
  activeClientsCount: number;
  workingDays: string[];
  emergencyContact?: IEmergencyContact;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
