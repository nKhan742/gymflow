import { z } from 'zod';

export const createDocumentsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  documentType: z.enum(['MEMBERSHIP_CONTRACT', 'LIABILITY_WAIVER', 'GOVERNMENT_ID', 'MEDICAL_CLEARANCE', 'CORPORATE_STUDENT_PROOF', 'PAYMENT_RECEIPT']).optional(),
  title: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
  fileFormat: z.string().optional(),
  fileUrl: z.string().optional(),
  verificationStatus: z.enum(['VERIFIED', 'PENDING_REVIEW', 'EXPIRED', 'REJECTED']).optional(),
  uploadDate: z.union([z.string(), z.date()]).optional(),
  expiryDate: z.union([z.string(), z.date()]).optional(),
  verifiedBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateDocumentsSchema = createDocumentsSchema.partial();
