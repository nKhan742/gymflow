import { z } from 'zod';

export const createSalarySchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  paySlipCode: z.string().optional(),
  staffId: z.string().optional(),
  staffCode: z.string().optional(),
  staffName: z.string().optional(),
  role: z.enum(['HEAD_TRAINER', 'FITNESS_COACH', 'GENERAL_MANAGER', 'FRONT_DESK', 'NUTRITIONIST', 'MAINTENANCE']).optional(),
  payPeriod: z.string().optional(),
  baseSalary: z.union([z.number(), z.string()]).optional(),
  commissionAmount: z.union([z.number(), z.string()]).optional(),
  bonusAmount: z.union([z.number(), z.string()]).optional(),
  deductions: z.union([z.number(), z.string()]).optional(),
  netSalary: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  paymentMethod: z.enum(['DIRECT_DEPOSIT', 'BANK_TRANSFER', 'CHECK', 'CASH']).optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  disbursementStatus: z.enum(['DISBURSED', 'PROCESSING', 'ON_HOLD']).optional(),
  disbursementDate: z.union([z.string(), z.date()]).optional(),
  disbursedBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateSalarySchema = createSalarySchema.partial();
