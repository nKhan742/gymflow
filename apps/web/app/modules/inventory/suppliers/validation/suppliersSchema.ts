import { z } from 'zod';

export const suppliersSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type SuppliersFormData = z.infer<typeof suppliersSchema>;
