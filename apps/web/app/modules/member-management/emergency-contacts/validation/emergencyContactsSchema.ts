import { z } from 'zod';

export const emergencyContactsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type EmergencyContactsFormData = z.infer<typeof emergencyContactsSchema>;
