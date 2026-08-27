import { z } from 'zod';

export const createTrainerCommissionSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  commissionCode: z.string().optional(),
  trainerId: z.string().optional(),
  trainerCode: z.string().optional(),
  trainerName: z.string().optional(),
  role: z.string().optional(),
  clientMemberCode: z.string().optional(),
  clientMemberName: z.string().optional(),
  commissionType: z.enum(['1_ON_1_PERSONAL_TRAINING', 'GROUP_FITNESS_CLASS', 'PACKAGE_SALES_COMMISSION', 'NUTRITION_MEAL_PLAN', 'MONTHLY_RETENTION_BONUS']).optional(),
  sessionTitle: z.string().optional(),
  billedAmount: z.union([z.number(), z.string()]).optional(),
  commissionRate: z.union([z.number(), z.string()]).optional(),
  commissionEarned: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  sessionCount: z.union([z.number(), z.string()]).optional(),
  sessionDate: z.union([z.string(), z.date()]).optional(),
  payoutStatus: z.enum(['SETTLED', 'PENDING_PAYOUT', 'IN_AUDIT']).optional(),
  payoutDate: z.union([z.string(), z.date()]).optional(),
  approvedBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateTrainerCommissionSchema = createTrainerCommissionSchema.partial();
