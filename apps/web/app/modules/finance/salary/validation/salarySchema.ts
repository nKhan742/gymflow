import { z } from 'zod';

export const salarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type SalaryFormData = z.infer<typeof salarySchema>;
