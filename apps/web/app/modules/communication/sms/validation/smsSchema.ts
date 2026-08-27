import { z } from 'zod';

export const smsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type SmsFormData = z.infer<typeof smsSchema>;
