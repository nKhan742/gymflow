import { z } from 'zod';

export const workoutTemplatesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type WorkoutTemplatesFormData = z.infer<typeof workoutTemplatesSchema>;
