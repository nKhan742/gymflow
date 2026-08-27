import { StatusType } from '../../../../database/base.model.js';

export interface IMedicalHistory {
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
  clearanceLevel: 'CLEARANCE_GRANTED' | 'MODIFIED_PROGRAM' | 'PHYSICIAN_CLEARANCE_REQUIRED';
  bloodGroup: string;
  chronicConditions: string[];
  allergies: string[];
  injuriesAndRestrictions: string;
  currentMedications?: string;
  physicianName?: string;
  physicianPhone?: string;
  waiverSigned: boolean;
  lastReviewDate: Date;
  reviewedBy: string;
  emergencyNotes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
