import { z } from 'zod';

export const trainerAnalyticsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TrainerAnalyticsFormData = z.infer<typeof trainerAnalyticsSchema>;
