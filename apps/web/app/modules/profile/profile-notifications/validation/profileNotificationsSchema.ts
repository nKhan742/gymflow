import { z } from 'zod';

export const profileNotificationsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ProfileNotificationsFormData = z.infer<typeof profileNotificationsSchema>;
