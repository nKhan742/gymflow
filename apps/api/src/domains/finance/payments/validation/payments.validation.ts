import { z } from 'zod';

export const createPaymentsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  transactionCode: z.string().optional(),
  invoiceNumber: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  category: z.enum(['MEMBERSHIP_RENEWAL', 'NEW_ENROLLMENT', 'PERSONAL_TRAINING', 'LOCKER_RENTAL', 'POS_RETAIL', 'DAY_PASS']).optional(),
  amount: z.union([z.number(), z.string()]).optional(),
  taxAmount: z.union([z.number(), z.string()]).optional(),
  discountAmount: z.union([z.number(), z.string()]).optional(),
  totalAmount: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  paymentMethod: z.enum(['CREDIT_CARD', 'POS_TERMINAL', 'CASH', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'UPI_QR']).optional(),
  paymentGateway: z.string().optional(),
  gatewayTransactionId: z.string().optional(),
  paymentStatus: z.enum(['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED']).optional(),
  paymentDate: z.union([z.string(), z.date()]).optional(),
  collectedBy: z.string().optional(),
  receiptUrl: z.string().optional(),
  notes: z.string().optional(),
  refundReason: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updatePaymentsSchema = createPaymentsSchema.partial();
