import { z } from 'zod';

export const referralsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ReferralsFormData = z.infer<typeof referralsSchema>;
