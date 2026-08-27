import { StatusType } from '../../../../database/base.model.js';

export interface ITrainerCommission {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  commissionCode: string;
  trainerId?: string;
  trainerCode: string;
  trainerName: string;
  role: string;
  clientMemberCode?: string;
  clientMemberName?: string;
  commissionType: '1_ON_1_PERSONAL_TRAINING' | 'GROUP_FITNESS_CLASS' | 'PACKAGE_SALES_COMMISSION' | 'NUTRITION_MEAL_PLAN' | 'MONTHLY_RETENTION_BONUS';
  sessionTitle: string;
  billedAmount: number;
  commissionRate: number;
  commissionEarned: number;
  currency: string;
  sessionCount: number;
  sessionDate: Date;
  payoutStatus: 'SETTLED' | 'PENDING_PAYOUT' | 'IN_AUDIT';
  payoutDate?: Date;
  approvedBy?: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
