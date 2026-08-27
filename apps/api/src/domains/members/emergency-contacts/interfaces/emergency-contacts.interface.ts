import { StatusType } from '../../../../database/base.model.js';

export interface IEmergencyContacts {
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
  contactName: string;
  relationship: 'SPOUSE' | 'PARENT' | 'SIBLING' | 'PARTNER' | 'GUARDIAN' | 'FRIEND' | 'PHYSICIAN';
  priority: 'PRIMARY' | 'SECONDARY' | 'PHYSICIAN';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isMedicalProxy: boolean;
  preferredHospital?: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
