import { z } from 'zod';

export const createProgressSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  memberId: z.string().optional(),
  memberCode: z.string().optional(),
  memberName: z.string().optional(),
  planTier: z.string().optional(),
  primaryGoal: z.enum(['FAT_LOSS', 'STRENGTH_HYPERTROPHY', 'ENDURANCE', 'REHAB_MOBILITY', 'GENERAL_FITNESS']).optional(),
  goalTitle: z.string().optional(),
  targetDate: z.union([z.string(), z.date()]).optional(),
  progressPercent: z.number().optional(),
  milestonesCompleted: z.number().optional(),
  totalMilestones: z.number().optional(),
  benchPressKg: z.number().optional(),
  squatKg: z.number().optional(),
  deadliftKg: z.number().optional(),
  adherencePercent: z.number().optional(),
  progressStatus: z.enum(['ON_TRACK', 'ATTENTION_NEEDED', 'GOAL_ACHIEVED']).optional(),
  assignedCoach: z.string().optional(),
  coachFeedback: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateProgressSchema = createProgressSchema.partial();
