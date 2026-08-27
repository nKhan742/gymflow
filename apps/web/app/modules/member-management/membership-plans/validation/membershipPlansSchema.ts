import { z } from 'zod';

export const membershipPlansSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MembershipPlansFormData = z.infer<typeof membershipPlansSchema>;
