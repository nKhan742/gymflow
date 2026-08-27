import { z } from 'zod';

export const createBmiSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  age: z.number().optional(),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  bmi: z.number().optional(),
  bmiCategory: z.enum(['UNDERWEIGHT', 'NORMAL', 'OVERWEIGHT', 'OBESE']).optional(),
  bodyFatPercent: z.number().optional(),
  muscleMassKg: z.number().optional(),
  visceralFat: z.number().optional(),
  bmrKcal: z.number().optional(),
  assessmentDate: z.union([z.string(), z.date()]).optional(),
  assessedBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateBmiSchema = createBmiSchema.partial();
