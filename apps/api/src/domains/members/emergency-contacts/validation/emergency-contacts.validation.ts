import { z } from 'zod';

export const createEmergencyContactsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  contactName: z.string().optional(),
  relationship: z.enum(['SPOUSE', 'PARENT', 'SIBLING', 'PARTNER', 'GUARDIAN', 'FRIEND', 'PHYSICIAN']).optional(),
  priority: z.enum(['PRIMARY', 'SECONDARY', 'PHYSICIAN']).optional(),
  phone: z.string().optional(),
  alternatePhone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  isMedicalProxy: z.boolean().optional(),
  preferredHospital: z.string().optional(),
  verificationStatus: z.enum(['VERIFIED', 'PENDING']).optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateEmergencyContactsSchema = createEmergencyContactsSchema.partial();
