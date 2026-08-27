import { z } from 'zod';

export const bmiSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type BmiFormData = z.infer<typeof bmiSchema>;
