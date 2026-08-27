import { z } from 'zod';

export const adminDashboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AdminDashboardFormData = z.infer<typeof adminDashboardSchema>;
