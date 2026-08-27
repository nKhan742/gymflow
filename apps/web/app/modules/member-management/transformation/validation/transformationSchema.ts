import { z } from 'zod';

export const transformationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TransformationFormData = z.infer<typeof transformationSchema>;
