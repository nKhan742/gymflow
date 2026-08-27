import { z } from 'zod';

export const trainerDashboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TrainerDashboardFormData = z.infer<typeof trainerDashboardSchema>;
