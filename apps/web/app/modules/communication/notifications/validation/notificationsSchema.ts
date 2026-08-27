import { z } from 'zod';

export const notificationsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type NotificationsFormData = z.infer<typeof notificationsSchema>;
