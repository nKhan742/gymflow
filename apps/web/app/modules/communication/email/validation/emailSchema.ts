import { z } from 'zod';

export const emailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type EmailFormData = z.infer<typeof emailSchema>;
