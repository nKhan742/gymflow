import { z } from 'zod';

export const visitorsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type VisitorsFormData = z.infer<typeof visitorsSchema>;
