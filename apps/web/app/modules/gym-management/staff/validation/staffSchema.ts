import { z } from 'zod';

export const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
