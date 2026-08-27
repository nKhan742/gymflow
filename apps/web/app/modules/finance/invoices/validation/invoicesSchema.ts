import { z } from 'zod';

export const invoicesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type InvoicesFormData = z.infer<typeof invoicesSchema>;
