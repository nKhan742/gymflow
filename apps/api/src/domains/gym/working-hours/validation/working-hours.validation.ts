import { z } from 'zod';

const dayScheduleSchema = z.object({
  day: z.string(),
  isOpen: z.boolean().default(true),
  openTime: z.string().default('05:30'),
  closeTime: z.string().default('23:00'),
});

export const createWorkingHoursSchema = z.object({
  name: z.string().min(1, 'Zone or facility name is required'),
  code: z.string().min(1, 'Zone code is required'),
  zoneType: z.enum(['MAIN_GYM', 'SPA_RECOVERY', 'SWIMMING_POOL', 'STUDIO_ROOM', 'SMOOTHIE_BAR', 'CHILDCARE']).default('MAIN_GYM'),
  is24x7: z.boolean().default(false),
  weeklySchedule: z.array(dayScheduleSchema).optional(),
  peakHoursStart: z.string().optional(),
  peakHoursEnd: z.string().optional(),
  maxCapacity: z.number().optional(),
  maintenanceWindow: z.string().optional(),
  branchId: z.string().default('ALL'),
  branchName: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateWorkingHoursSchema = createWorkingHoursSchema.partial();
