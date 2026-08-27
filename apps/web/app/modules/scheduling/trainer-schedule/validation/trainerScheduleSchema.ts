import { z } from 'zod';

export const trainerScheduleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TrainerScheduleFormData = z.infer<typeof trainerScheduleSchema>;
