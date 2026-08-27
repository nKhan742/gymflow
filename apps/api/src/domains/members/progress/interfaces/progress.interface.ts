import { StatusType } from '../../../../database/base.model.js';

export interface IProgress {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  primaryGoal: 'FAT_LOSS' | 'STRENGTH_HYPERTROPHY' | 'ENDURANCE' | 'REHAB_MOBILITY' | 'GENERAL_FITNESS';
  goalTitle: string;
  targetDate: Date;
  progressPercent: number;
  milestonesCompleted: number;
  totalMilestones: number;
  benchPressKg: number;
  squatKg: number;
  deadliftKg: number;
  adherencePercent: number;
  progressStatus: 'ON_TRACK' | 'ATTENTION_NEEDED' | 'GOAL_ACHIEVED';
  assignedCoach: string;
  coachFeedback?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
