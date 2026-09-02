import { z } from 'zod';

export const createShiftManagementSchema = z.object({
  name: z.string().min(1, 'Shift name is required'),
  code: z.string().min(1, 'Shift code is required'),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  durationHours: z.number().default(8.0),
  breakDurationMins: z.number().optional(),
  minHeadcount: z.number().default(2),
  daysOfWeek: z.array(z.string()).optional(),
  gracePeriodMins: z.number().optional(),
  overtimeMultiplier: z.number().optional(),
  color: z.string().optional(),
  branchId: z.string().default('ALL'),
  branchName: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  description: z.string().optional(),
  assignedStaffCount: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateShiftManagementSchema = createShiftManagementSchema.partial();
