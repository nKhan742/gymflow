import { z } from 'zod';

export const accountantDashboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AccountantDashboardFormData = z.infer<typeof accountantDashboardSchema>;
