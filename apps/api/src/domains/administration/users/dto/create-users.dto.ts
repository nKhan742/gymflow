export interface CreateUsersDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: string;
  permissions?: string[];
  branchId?: string;
  phone?: string;
  status?: string;
}
