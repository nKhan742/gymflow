import { z } from 'zod';

export const announcementsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AnnouncementsFormData = z.infer<typeof announcementsSchema>;
