import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
