import { z } from 'zod';

export const branchesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type BranchesFormData = z.infer<typeof branchesSchema>;
