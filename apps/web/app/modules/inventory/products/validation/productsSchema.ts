import { z } from 'zod';

export const productsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ProductsFormData = z.infer<typeof productsSchema>;
