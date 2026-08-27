import { z } from 'zod';

export const systemConfigurationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type SystemConfigurationFormData = z.infer<typeof systemConfigurationSchema>;
