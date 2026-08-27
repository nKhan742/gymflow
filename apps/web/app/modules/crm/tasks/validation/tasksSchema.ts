import { z } from 'zod';

export const tasksSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TasksFormData = z.infer<typeof tasksSchema>;
