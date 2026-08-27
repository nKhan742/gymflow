import { z } from 'zod';

export const bodyMeasurementsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type BodyMeasurementsFormData = z.infer<typeof bodyMeasurementsSchema>;
