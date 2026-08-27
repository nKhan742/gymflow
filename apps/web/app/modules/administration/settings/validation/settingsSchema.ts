import { z } from 'zod';

export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
