import { z } from 'zod';

export const documentsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type DocumentsFormData = z.infer<typeof documentsSchema>;
