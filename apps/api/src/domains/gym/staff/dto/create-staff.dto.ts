import { IEmergencyContact } from '../interfaces/staff.interface.js';

export interface CreateStaffDto {
  firstName: string;
  lastName: string;
  name?: string;
  code?: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: 'TRAINER' | 'HEAD_COACH' | 'NUTRITIONIST' | 'RECEPTIONIST' | 'MANAGER' | 'MAINTENANCE' | 'GROUP_INSTRUCTOR';
  department?: string;
  specializations?: string[];
  certifications?: string[];
  shift?: 'MORNING' | 'EVENING' | 'NIGHT' | 'FLEXIBLE';
  hourlyRate?: number;
  salary?: number;
  commissionPercentage?: number;
  hireDate?: string;
  rating?: number;
  reviewsCount?: number;
  activeClientsCount?: number;
  workingDays?: string[];
  emergencyContact?: IEmergencyContact;
  status?: 'active' | 'inactive' | 'on_leave' | 'pending' | 'suspended' | 'archived';
  description?: string;
}
