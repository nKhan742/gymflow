import { z } from 'zod';

export const posSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type PosFormData = z.infer<typeof posSchema>;
