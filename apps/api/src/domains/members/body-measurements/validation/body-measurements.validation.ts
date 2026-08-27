import { z } from 'zod';

export const createBodyMeasurementsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  measurementDate: z.union([z.string(), z.date()]).optional(),
  unit: z.enum(['CM', 'INCHES']).optional(),
  chest: z.number().optional(),
  shoulders: z.number().optional(),
  leftArm: z.number().optional(),
  rightArm: z.number().optional(),
  waist: z.number().optional(),
  hips: z.number().optional(),
  leftThigh: z.number().optional(),
  rightThigh: z.number().optional(),
  calves: z.number().optional(),
  waistToHipRatio: z.number().optional(),
  whrCategory: z.enum(['LOW_RISK', 'MODERATE_RISK', 'HIGH_RISK']).optional(),
  measuredBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateBodyMeasurementsSchema = createBodyMeasurementsSchema.partial();
