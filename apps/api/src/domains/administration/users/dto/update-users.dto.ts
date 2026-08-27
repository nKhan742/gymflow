export interface UpdateUsersDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  branchId?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  status?: string;
}
