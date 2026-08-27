import { z } from 'zod';

export const usersSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type UsersFormData = z.infer<typeof usersSchema>;
