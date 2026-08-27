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
  avatar?: string;
  isActive: boolean;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
