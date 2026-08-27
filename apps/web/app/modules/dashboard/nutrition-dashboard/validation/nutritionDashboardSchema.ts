import { z } from 'zod';

export const nutritionDashboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type NutritionDashboardFormData = z.infer<typeof nutritionDashboardSchema>;
