import { z } from 'zod';

export const freezeMembershipSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type FreezeMembershipFormData = z.infer<typeof freezeMembershipSchema>;
