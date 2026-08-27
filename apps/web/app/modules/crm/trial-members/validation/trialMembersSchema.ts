import { z } from 'zod';

export const trialMembersSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TrialMembersFormData = z.infer<typeof trialMembersSchema>;
