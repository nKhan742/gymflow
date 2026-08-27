import { z } from 'zod';

export const createMembershipRenewalsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  memberEmail: z.string().optional(),
  memberPhone: z.string().optional(),
  currentPlan: z.string().optional(),
  currentTier: z.string().optional(),
  expiryDate: z.union([z.string(), z.date()]).optional(),
  daysRemaining: z.number().optional(),
  renewalStatus: z.enum(['EXPIRED', 'EXPIRING_CRITICAL', 'EXPIRING_SOON', 'RENEWED', 'AUTO_RENEW_PENDING']).optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  autoRenew: z.boolean().optional(),
  paymentMethod: z.string().optional(),
  lastContactDate: z.union([z.string(), z.date()]).optional(),
  contactChannel: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateMembershipRenewalsSchema = createMembershipRenewalsSchema.partial();
