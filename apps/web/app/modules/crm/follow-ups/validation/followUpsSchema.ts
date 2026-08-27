import { z } from 'zod';

export const followUpsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type FollowUpsFormData = z.infer<typeof followUpsSchema>;
