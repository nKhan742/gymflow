import { z } from 'zod';

export const createDiscountsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  promoCode: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_TRIAL_PERIOD']).optional(),
  discountValue: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  applicableDomain: z.enum(['ALL_MEMBERSHIPS', 'ANNUAL_VIP', 'PERSONAL_TRAINING', 'POS_RETAIL', 'STUDENT_CORPORATE']).optional(),
  minPurchaseAmount: z.union([z.number(), z.string()]).optional(),
  maxUsageCount: z.union([z.number(), z.string()]).optional(),
  usedCount: z.union([z.number(), z.string()]).optional(),
  startDate: z.union([z.string(), z.date()]).optional(),
  expiryDate: z.union([z.string(), z.date()]).optional(),
  isActive: z.boolean().optional(),
  createdBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateDiscountsSchema = createDiscountsSchema.partial();
