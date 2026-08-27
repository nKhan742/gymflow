import { z } from 'zod';

export const membershipRenewalsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MembershipRenewalsFormData = z.infer<typeof membershipRenewalsSchema>;
