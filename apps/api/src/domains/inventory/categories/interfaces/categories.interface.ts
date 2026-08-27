import { StatusType } from '../../../../database/base.model.js';

export interface ICategories {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  categoryCode: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
  taxRate: number;
  isDisplayedInPOS: boolean;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
