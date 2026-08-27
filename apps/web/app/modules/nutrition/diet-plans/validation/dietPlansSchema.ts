import { z } from 'zod';

export const dietPlansSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type DietPlansFormData = z.infer<typeof dietPlansSchema>;
