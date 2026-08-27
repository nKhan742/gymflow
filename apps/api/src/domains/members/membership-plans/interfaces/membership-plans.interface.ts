import { StatusType } from '../../../../database/base.model.js';

export interface IMembershipPlans {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  tier: 'VIP_PLATINUM' | 'GOLD_ANNUAL' | 'SILVER_MONTHLY' | 'STUDENT_CORPORATE' | 'OFF_PEAK' | 'CLASS_PACK';
  price: number;
  currency: string;
  billingCycle: 'ANNUAL' | 'MONTHLY' | 'QUARTERLY' | 'PACK';
  initiationFee: number;
  accessHours: string;
  multiBranch: boolean;
  inclusions: string[];
  maxFreezeDays: number;
  popular?: boolean;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
