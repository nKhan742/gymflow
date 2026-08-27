import { z } from 'zod';

export const leadsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type LeadsFormData = z.infer<typeof leadsSchema>;
