import { z } from 'zod';

export const createAttendanceSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  checkInTime: z.union([z.string(), z.date()]).optional(),
  checkOutTime: z.union([z.string(), z.date()]).optional(),
  durationMinutes: z.number().optional(),
  method: z.enum(['BIOMETRIC_FACE', 'RFID_KEYCARD', 'QR_MOBILE', 'MANUAL_DESK']).optional(),
  gateLocation: z.string().optional(),
  accessResult: z.enum(['GRANTED', 'DENIED_EXPIRED', 'DENIED_FROZEN', 'DENIED_OFF_PEAK']).optional(),
  turnstileCode: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateAttendanceSchema = createAttendanceSchema.partial();
