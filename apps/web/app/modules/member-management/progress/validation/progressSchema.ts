import { z } from 'zod';

export const progressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ProgressFormData = z.infer<typeof progressSchema>;
