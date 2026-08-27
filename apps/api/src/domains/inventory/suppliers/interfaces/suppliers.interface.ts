import { StatusType } from '../../../../database/base.model.js';

export interface ISuppliers {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  supplierCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  categoriesSupplied: string;
  paymentTerms: 'NET_30' | 'NET_15' | 'NET_60' | 'PREPAID' | 'COD';
  rating: number;
  totalOrdersPlaced: number;
  totalSpend: number;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
