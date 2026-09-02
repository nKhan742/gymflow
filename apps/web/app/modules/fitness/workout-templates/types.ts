export interface ITemplateExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  rpe?: number;
  notes?: string;
}

export interface IWorkoutTemplate {
  id: string;
  _id?: string;
  name: string;
  code: string;
  splitType: 'PUSH' | 'PULL' | 'LEGS' | 'UPPER' | 'LOWER' | 'FULL_BODY' | 'HIIT' | 'FIGHT_CAMP';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  estimatedDurationMins: number;
  targetGoal: 'HYPERTROPHY' | 'MAX_STRENGTH' | 'FAT_LOSS' | 'ENDURANCE' | 'ATHLETIC_POWER';
  exercises: ITemplateExercise[];
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
