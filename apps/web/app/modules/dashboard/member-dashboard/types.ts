export interface IMemberProfileCard {
  id: string;
  memberName: string;
  memberCode: string;
  memberAvatar?: string;
  membershipPlan: string;
  planExpiryDate: string;
  passportStatus: 'ACTIVE' | 'FROZEN' | 'EXPIRED';
  nfcPasscode: string;
  homeCampus: string;
}

export interface IWorkoutExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weightTarget: string;
  completed?: boolean;
}

export interface ITodayWorkoutRoutine {
  routineName: string;
  coachName: string;
  coachAvatar?: string;
  durationMinutes: number;
  exercises: IWorkoutExerciseItem[];
}

export interface IDailyNutritionGoal {
  caloriesCurrent: number;
  calorieTarget: number;
  proteinCurrentGrams: number;
  proteinTargetGrams: number;
  carbsCurrentGrams: number;
  carbsTargetGrams: number;
  waterCurrentLiters: number;
  waterTargetLiters: number;
}

export interface IMemberDashboardStats {
  workoutStreakDays: number;
  monthlyGymVisits: number;
  remainingPtSessions: number;
  activeChallengeRank: string;
}
