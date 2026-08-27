import { z } from 'zod';

export const attendanceReportsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AttendanceReportsFormData = z.infer<typeof attendanceReportsSchema>;
