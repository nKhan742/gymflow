import { z } from 'zod';

export const exerciseLibrarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ExerciseLibraryFormData = z.infer<typeof exerciseLibrarySchema>;
