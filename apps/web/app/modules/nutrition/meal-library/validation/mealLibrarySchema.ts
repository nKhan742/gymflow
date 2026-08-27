import { z } from 'zod';

export const mealLibrarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MealLibraryFormData = z.infer<typeof mealLibrarySchema>;
