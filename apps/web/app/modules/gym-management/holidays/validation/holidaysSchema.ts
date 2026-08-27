import { z } from 'zod';

export const holidaysSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type HolidaysFormData = z.infer<typeof holidaysSchema>;
