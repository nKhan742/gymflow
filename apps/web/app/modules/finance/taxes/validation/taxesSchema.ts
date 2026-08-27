import { z } from 'zod';

export const taxesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TaxesFormData = z.infer<typeof taxesSchema>;
