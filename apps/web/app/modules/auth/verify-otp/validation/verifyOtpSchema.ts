import { z } from 'zod';

export const verifyOtpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
