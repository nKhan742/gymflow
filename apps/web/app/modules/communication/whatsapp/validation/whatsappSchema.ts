import { z } from 'zod';

export const whatsappSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type WhatsappFormData = z.infer<typeof whatsappSchema>;
