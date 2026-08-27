import { z } from 'zod';

export const gymProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type GymProfileFormData = z.infer<typeof gymProfileSchema>;
