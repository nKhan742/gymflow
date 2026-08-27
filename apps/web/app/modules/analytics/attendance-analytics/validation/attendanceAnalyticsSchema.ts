import { z } from 'zod';

export const attendanceAnalyticsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AttendanceAnalyticsFormData = z.infer<typeof attendanceAnalyticsSchema>;
