import { z } from 'zod';

export const serviceHistorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ServiceHistoryFormData = z.infer<typeof serviceHistorySchema>;
