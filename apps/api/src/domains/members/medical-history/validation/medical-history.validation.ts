import { z } from 'zod';

export const createMedicalHistorySchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  clearanceLevel: z.enum(['CLEARANCE_GRANTED', 'MODIFIED_PROGRAM', 'PHYSICIAN_CLEARANCE_REQUIRED']).optional(),
  bloodGroup: z.string().optional(),
  chronicConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  injuriesAndRestrictions: z.string().optional(),
  currentMedications: z.string().optional(),
  physicianName: z.string().optional(),
  physicianPhone: z.string().optional(),
  waiverSigned: z.boolean().optional(),
  lastReviewDate: z.union([z.string(), z.date()]).optional(),
  reviewedBy: z.string().optional(),
  emergencyNotes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateMedicalHistorySchema = createMedicalHistorySchema.partial();
