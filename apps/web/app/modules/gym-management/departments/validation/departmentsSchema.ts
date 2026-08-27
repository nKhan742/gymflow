import { z } from 'zod';

export const departmentsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type DepartmentsFormData = z.infer<typeof departmentsSchema>;
