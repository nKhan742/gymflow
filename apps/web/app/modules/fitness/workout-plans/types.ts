export interface IPlanWeek {
  weekNumber: number;
  phaseName: string;
  focus: string;
  daysPerWeek: number;
}

export interface IWorkoutPlan {
  id: string;
  _id?: string;
  name: string;
  code: string;
  category: 'BODYBUILDING' | 'POWERLIFTING' | 'FAT_LOSS' | 'FUNCTIONAL_ATHLETE' | 'BOXING_CONDITIONING' | 'GENERAL_FITNESS';
  durationWeeks: number;
  frequencyDaysPerWeek: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  enrolledAthletesCount: number;
  targetGoal: string;
  phases: IPlanWeek[];
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  description?: string;
  authorCoachName?: string;
  createdAt?: string;
  updatedAt?: string;
}
