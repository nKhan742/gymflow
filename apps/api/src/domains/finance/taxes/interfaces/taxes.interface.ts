import { StatusType } from '../../../../database/base.model.js';

export interface ITaxes {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  taxCode: string;
  taxName: string;
  description?: string;
  taxRate: number;
  taxType: 'STANDARD_SALES_TAX' | 'FITNESS_SERVICES_TAX' | 'POS_RETAIL_NUTRITION_TAX' | 'ZERO_RATED_EXEMPT' | 'MUNICIPAL_RECREATION_CESS';
  calculationMethod: 'EXCLUSIVE' | 'INCLUSIVE';
  applicableCategory: 'ALL_MEMBERSHIPS' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_EXEMPT' | 'ALL_SERVICES';
  taxRegistrationNumber: string;
  isDefault: boolean;
  isActive: boolean;
  effectiveFrom: Date;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
