import { StatusType } from '../../../../database/base.model.js';

export interface IUsers {
  id: string;
  tenantId: string;
  branchId?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  phone?: string;
  name?: string;
  fullName?: string;
  avatar?: string;
  avatarUrl?: string;
  isActive: boolean;
  status: any;
  createdAt: Date;
  updatedAt: Date;
}
