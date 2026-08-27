import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
