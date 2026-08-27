import { z } from 'zod';

export const resourceBookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ResourceBookingFormData = z.infer<typeof resourceBookingSchema>;
