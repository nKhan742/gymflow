import { z } from 'zod';

export const categoriesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type CategoriesFormData = z.infer<typeof categoriesSchema>;
