export interface IWorkoutAssignment {
  id: string;
  _id?: string;
  assignmentCode: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  memberEmail?: string;
  coachId: string;
  coachName: string;
  programType: 'WORKOUT_PLAN' | 'CUSTOM_TEMPLATE' | 'REHAB_PROTOCOL';
  programId: string;
  programTitle: string;
  startDate: string;
  targetEndDate: string;
  completedWorkouts: number;
  totalWorkouts: number;
  complianceRate: number; // percentage e.g. 92
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'OVERDUE';
  branchId?: string;
  branchName?: string;
  notes?: string;
  lastCompletedWorkoutDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
