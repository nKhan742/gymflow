export interface IExercise {
  id: string;
  _id?: string;
  name: string;
  code: string;
  category: string;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  mechanics: 'COMPOUND' | 'ISOLATION';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  equipment: 'BARBELL' | 'DUMBBELL' | 'CABLE' | 'MACHINE' | 'BODYWEIGHT' | 'KETTLEBELL' | 'RESISTANCE_BAND' | 'SPECIALTY';
  forceType?: 'PUSH' | 'PULL' | 'STATIC' | 'DYNAMIC';
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  coachingCues: string[];
  caloriesBurnPerHour?: number;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}
