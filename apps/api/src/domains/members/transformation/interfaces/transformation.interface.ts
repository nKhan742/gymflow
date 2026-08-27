import { StatusType } from '../../../../database/base.model.js';

export interface ITransformation {
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
  planTier: string;
  category: 'FAT_LOSS_SHRED' | 'MUSCLE_BUILDING' | 'LIFESTYLE_REHAB' | 'BRIDE_GROOM_PREP';
  title: string;
  durationMonths: number;
  beforeWeightKg: number;
  afterWeightKg: number;
  weightChangeKg: number;
  beforeBodyFat: number;
  afterBodyFat: number;
  bodyFatChange: number;
  waistChangeCm: number;
  beforePhoto?: string;
  afterPhoto?: string;
  story: string;
  coachName: string;
  isFeatured: boolean;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
