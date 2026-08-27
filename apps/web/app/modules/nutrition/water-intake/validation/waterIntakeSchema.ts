import { z } from 'zod';

export const waterIntakeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type WaterIntakeFormData = z.infer<typeof waterIntakeSchema>;
