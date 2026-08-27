import { z } from 'zod';

export const permissionsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type PermissionsFormData = z.infer<typeof permissionsSchema>;
