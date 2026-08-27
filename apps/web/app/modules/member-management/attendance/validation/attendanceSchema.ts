import { z } from 'zod';

export const attendanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceSchema>;
