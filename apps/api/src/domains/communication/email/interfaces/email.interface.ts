import { StatusType } from '../../../../database/base.model.js';

export interface IEmail {
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
