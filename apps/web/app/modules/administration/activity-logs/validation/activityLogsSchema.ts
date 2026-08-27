import { z } from 'zod';

export const activityLogsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ActivityLogsFormData = z.infer<typeof activityLogsSchema>;
