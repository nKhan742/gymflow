import { StatusType } from '../../../../database/base.model.js';

export interface IBmi {
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
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
  bodyFatPercent: number;
  muscleMassKg: number;
  visceralFat: number;
  bmrKcal: number;
  assessmentDate: Date;
  assessedBy: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
