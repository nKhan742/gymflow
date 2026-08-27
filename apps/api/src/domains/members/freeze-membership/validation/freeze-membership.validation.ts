import { z } from 'zod';

export const createFreezeMembershipSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  memberEmail: z.string().optional(),
  memberPhone: z.string().optional(),
  planTier: z.string().optional(),
  startDate: z.union([z.string(), z.date()]).optional(),
  endDate: z.union([z.string(), z.date()]).optional(),
  durationDays: z.number().optional(),
  reason: z.enum(['MEDICAL', 'TRAVEL', 'WORK_RELOCATION', 'PERSONAL', 'PREGNANCY']).optional(),
  freezeStatus: z.enum(['ACTIVE_FROZEN', 'SCHEDULED', 'PENDING_APPROVAL', 'COMPLETED_UNFROZEN', 'REJECTED']).optional(),
  feeAmount: z.number().optional(),
  quotaDaysUsed: z.number().optional(),
  maxQuotaDays: z.number().optional(),
  doctorNoteAttached: z.boolean().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateFreezeMembershipSchema = createFreezeMembershipSchema.partial();
