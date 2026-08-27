import { z } from 'zod';

export const expensesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ExpensesFormData = z.infer<typeof expensesSchema>;
