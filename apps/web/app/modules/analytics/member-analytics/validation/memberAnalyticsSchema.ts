import { z } from 'zod';

export const memberAnalyticsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MemberAnalyticsFormData = z.infer<typeof memberAnalyticsSchema>;
