export interface IUserModel {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FACILITY_ADMIN' | 'BRANCH_MANAGER' | 'STAFF_USER' | 'AUDITOR';
  roleName: string;
  department: string;
  branchId?: string;
  branchName: string;
  mfaEnabled: boolean;
  lastLoginAt: string;
  ipAddress: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
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
