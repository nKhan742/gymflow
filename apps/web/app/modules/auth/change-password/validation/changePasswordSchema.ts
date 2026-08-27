import { z } from 'zod';

export const changePasswordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
