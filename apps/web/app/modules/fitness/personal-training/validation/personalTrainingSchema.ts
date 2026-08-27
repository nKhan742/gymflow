import { z } from 'zod';

export const personalTrainingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type PersonalTrainingFormData = z.infer<typeof personalTrainingSchema>;
