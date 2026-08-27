import { z } from 'zod';

export const createWalletSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  walletCode: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  currentBalance: z.union([z.number(), z.string()]).optional(),
  lifetimeDeposited: z.union([z.number(), z.string()]).optional(),
  lifetimeSpent: z.union([z.number(), z.string()]).optional(),
  rewardPoints: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  autoTopUpEnabled: z.boolean().optional(),
  autoTopUpThreshold: z.union([z.number(), z.string()]).optional(),
  autoTopUpAmount: z.union([z.number(), z.string()]).optional(),
  lastTransactionDate: z.union([z.string(), z.date()]).optional(),
  lastTransactionType: z.enum(['TOP_UP_DEPOSIT', 'CAFE_POS_DEBIT', 'SESSION_DEBIT', 'CASHBACK_REWARD', 'REFUND_CREDIT']).optional(),
  lastTransactionAmount: z.union([z.number(), z.string()]).optional(),
  walletStatus: z.enum(['ACTIVE', 'LOW_BALANCE', 'FROZEN']).optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateWalletSchema = createWalletSchema.partial();
