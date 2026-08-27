import { z } from 'zod';

export const profileChangePasswordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ProfileChangePasswordFormData = z.infer<typeof profileChangePasswordSchema>;
