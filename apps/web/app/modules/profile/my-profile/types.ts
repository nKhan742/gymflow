export interface IMyProfileModel {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  avatarUrl?: string;
  coverBannerUrl?: string;
  employeeId: string;
  securityRole: 'SUPER_ADMIN' | 'FACILITY_MANAGER' | 'HEAD_COACH' | 'FINANCE_DIRECTOR' | 'FRONT_DESK';
  shiftSchedule: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bio: string;
  certifications: string[];
  profileCompletionScore: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESTRICTED';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMyProfileModelFilters {
  search?: string;
  securityRole?: string;
  status?: string;
  branchId?: string;
}
