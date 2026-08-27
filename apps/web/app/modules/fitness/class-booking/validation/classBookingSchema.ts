import { z } from 'zod';

export const classBookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ClassBookingFormData = z.infer<typeof classBookingSchema>;
