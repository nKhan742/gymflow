import { StatusType } from '../../../../database/base.model.js';

export interface IDiscounts {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  promoCode: string;
  title: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_TRIAL_PERIOD';
  discountValue: number;
  currency: string;
  applicableDomain: 'ALL_MEMBERSHIPS' | 'ANNUAL_VIP' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_CORPORATE';
  minPurchaseAmount: number;
  maxUsageCount: number;
  usedCount: number;
  startDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdBy?: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
