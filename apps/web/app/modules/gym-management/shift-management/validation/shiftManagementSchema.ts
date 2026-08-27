import { z } from 'zod';

export const shiftManagementSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ShiftManagementFormData = z.infer<typeof shiftManagementSchema>;
