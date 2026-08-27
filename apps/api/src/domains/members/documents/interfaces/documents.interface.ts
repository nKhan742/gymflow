import { StatusType } from '../../../../database/base.model.js';

export interface IDocuments {
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
  documentType: 'MEMBERSHIP_CONTRACT' | 'LIABILITY_WAIVER' | 'GOVERNMENT_ID' | 'MEDICAL_CLEARANCE' | 'CORPORATE_STUDENT_PROOF' | 'PAYMENT_RECEIPT';
  title: string;
  fileName: string;
  fileSize: string;
  fileFormat: string;
  fileUrl?: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'EXPIRED' | 'REJECTED';
  uploadDate: Date;
  expiryDate?: Date;
  verifiedBy?: string;
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
