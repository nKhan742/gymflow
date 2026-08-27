import { z } from 'zod';

export const myProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MyProfileFormData = z.infer<typeof myProfileSchema>;
