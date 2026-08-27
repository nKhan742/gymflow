import { StatusType } from '../../../../database/base.model.js';

export interface IShiftManagement {
  id: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
