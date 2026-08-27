import { z } from 'zod';

export const discountsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type DiscountsFormData = z.infer<typeof discountsSchema>;
