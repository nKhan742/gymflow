import { z } from 'zod';

export const medicalHistorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>;
