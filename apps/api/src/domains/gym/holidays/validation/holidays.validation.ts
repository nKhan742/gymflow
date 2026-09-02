import { z } from 'zod';

export const createHolidaysSchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  code: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  category: z.enum(['NATIONAL', 'MAINTENANCE', 'SPECIAL_EVENT', 'EMERGENCY']).default('NATIONAL'),
  operationalMode: z.enum(['CLOSED', 'REDUCED_HOURS', 'SELF_SERVICE']).default('CLOSED'),
  reducedHoursSchedule: z.string().optional(),
  classPolicy: z.enum(['AUTO_CANCEL', 'RESCHEDULE', 'KEEP_SCHEDULED']).default('AUTO_CANCEL'),
  ptPolicy: z.enum(['AUTO_CANCEL', 'PERMITTED']).default('AUTO_CANCEL'),
  branchId: z.string().default('ALL'),
  branchName: z.string().optional(),
  memberBroadcast: z.boolean().default(true),
  status: z.enum(['active', 'archived']).default('active'),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateHolidaysSchema = createHolidaysSchema.partial();
