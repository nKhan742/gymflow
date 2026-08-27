import { z } from 'zod';

export const financeReportsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type FinanceReportsFormData = z.infer<typeof financeReportsSchema>;
