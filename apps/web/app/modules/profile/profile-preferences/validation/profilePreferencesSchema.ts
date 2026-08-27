import { z } from 'zod';

export const profilePreferencesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ProfilePreferencesFormData = z.infer<typeof profilePreferencesSchema>;
