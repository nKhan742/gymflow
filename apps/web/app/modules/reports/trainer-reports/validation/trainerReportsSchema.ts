import { z } from 'zod';

export const trainerReportsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TrainerReportsFormData = z.infer<typeof trainerReportsSchema>;
