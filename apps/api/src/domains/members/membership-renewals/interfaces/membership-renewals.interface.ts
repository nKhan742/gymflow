import { StatusType } from '../../../../database/base.model.js';

export interface IMembershipRenewals {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  currentPlan: string;
  currentTier: string;
  expiryDate: Date;
  daysRemaining: number;
  renewalStatus: 'EXPIRED' | 'EXPIRING_CRITICAL' | 'EXPIRING_SOON' | 'RENEWED' | 'AUTO_RENEW_PENDING';
  amount: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod: string;
  lastContactDate?: Date;
  contactChannel?: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
