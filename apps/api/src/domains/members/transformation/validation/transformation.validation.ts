import { z } from 'zod';

export const createTransformationSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  category: z.enum(['FAT_LOSS_SHRED', 'MUSCLE_BUILDING', 'LIFESTYLE_REHAB', 'BRIDE_GROOM_PREP']).optional(),
  title: z.string().optional(),
  durationMonths: z.number().optional(),
  beforeWeightKg: z.number().optional(),
  afterWeightKg: z.number().optional(),
  weightChangeKg: z.number().optional(),
  beforeBodyFat: z.number().optional(),
  afterBodyFat: z.number().optional(),
  bodyFatChange: z.number().optional(),
  waistChangeCm: z.number().optional(),
  beforePhoto: z.string().optional(),
  afterPhoto: z.string().optional(),
  story: z.string().optional(),
  coachName: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateTransformationSchema = createTransformationSchema.partial();
