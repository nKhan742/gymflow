import { z } from 'zod';

export const membersSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MembersFormData = z.infer<typeof membersSchema>;
