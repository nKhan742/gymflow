export type GymUserRole =
  | 'ADMIN'
  | 'BRANCH_MANAGER'
  | 'TRAINER'
  | 'RECEPTIONIST'
  | 'NUTRITIONIST'
  | 'MEMBER'
  | 'SUPER_ADMIN'
  | 'FACILITY_ADMIN'
  | string;

export interface IUserModel {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone: string;
  role: GymUserRole;
  roleName: string;
  department: string;
  branchId?: string;
  branchName: string;
  mfaEnabled: boolean;
  lastLoginAt: string;
  ipAddress: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED' | string;
  securityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserModelFilters {
  search?: string;
  role?: string;
  status?: string;
  branchId?: string;
}
