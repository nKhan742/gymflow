import { z } from 'zod';

export const createPreferencesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
});

export const updatePreferencesSchema = createPreferencesSchema.partial();
