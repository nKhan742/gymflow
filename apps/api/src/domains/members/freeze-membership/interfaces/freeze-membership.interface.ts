import { StatusType } from '../../../../database/base.model.js';

export interface IFreezeMembership {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  planTier: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  reason: 'MEDICAL' | 'TRAVEL' | 'WORK_RELOCATION' | 'PERSONAL' | 'PREGNANCY';
  freezeStatus: 'ACTIVE_FROZEN' | 'SCHEDULED' | 'PENDING_APPROVAL' | 'COMPLETED_UNFROZEN' | 'REJECTED';
  feeAmount: number;
  quotaDaysUsed: number;
  maxQuotaDays: number;
  doctorNoteAttached: boolean;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
