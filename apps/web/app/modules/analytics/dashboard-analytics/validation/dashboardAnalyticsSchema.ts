import { z } from 'zod';

export const dashboardAnalyticsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type DashboardAnalyticsFormData = z.infer<typeof dashboardAnalyticsSchema>;
