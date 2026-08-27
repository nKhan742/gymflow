import { z } from 'zod';

export const revenueReportsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type RevenueReportsFormData = z.infer<typeof revenueReportsSchema>;
