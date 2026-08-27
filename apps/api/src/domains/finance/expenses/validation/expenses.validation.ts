import { z } from 'zod';

export const createExpensesSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  voucherCode: z.string().optional(),
  vendorName: z.string().optional(),
  category: z.enum(['EQUIPMENT_MAINTENANCE', 'FACILITY_RENT', 'UTILITIES_HVAC', 'INVENTORY_SUPPLIES', 'MARKETING_ADS', 'SOFTWARE_SAAS', 'PETTY_CASH_MISC']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  amount: z.union([z.number(), z.string()]).optional(),
  taxAmount: z.union([z.number(), z.string()]).optional(),
  totalAmount: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  paymentMethod: z.enum(['CORPORATE_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK', 'PETTY_CASH']).optional(),
  paymentStatus: z.enum(['PAID', 'PENDING_APPROVAL', 'SCHEDULED', 'REJECTED']).optional(),
  expenseDate: z.union([z.string(), z.date()]).optional(),
  dueDate: z.union([z.string(), z.date()]).optional(),
  recordedBy: z.string().optional(),
  approvedBy: z.string().optional(),
  receiptFileName: z.string().optional(),
  receiptUrl: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateExpensesSchema = createExpensesSchema.partial();
