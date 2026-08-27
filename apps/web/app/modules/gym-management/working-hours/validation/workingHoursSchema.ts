import { z } from 'zod';

export const workingHoursSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type WorkingHoursFormData = z.infer<typeof workingHoursSchema>;
