import { z } from 'zod';

export const fitnessAssessmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type FitnessAssessmentFormData = z.infer<typeof fitnessAssessmentSchema>;
