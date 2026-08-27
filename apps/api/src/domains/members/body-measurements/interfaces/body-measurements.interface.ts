import { StatusType } from '../../../../database/base.model.js';

export interface IBodyMeasurements {
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
  measurementDate: Date;
  unit: 'CM' | 'INCHES';
  chest: number;
  shoulders: number;
  leftArm: number;
  rightArm: number;
  waist: number;
  hips: number;
  leftThigh: number;
  rightThigh: number;
  calves: number;
  waistToHipRatio: number;
  whrCategory: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  measuredBy: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
