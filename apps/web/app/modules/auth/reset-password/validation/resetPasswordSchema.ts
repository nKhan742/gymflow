import { z } from 'zod';

export const resetPasswordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
