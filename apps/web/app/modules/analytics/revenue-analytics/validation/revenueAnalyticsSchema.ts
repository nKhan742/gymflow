import { z } from 'zod';

export const revenueAnalyticsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type RevenueAnalyticsFormData = z.infer<typeof revenueAnalyticsSchema>;
