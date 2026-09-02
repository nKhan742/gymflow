export interface IExerciseCategory {
  id: string;
  _id?: string;
  name: string;
  code: string;
  primaryMuscleGroup: 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'CARDIO' | 'MOBILITY' | 'FULL_BODY';
  movementPattern: 'PUSH' | 'PULL' | 'SQUAT' | 'HINGE' | 'LUNGE' | 'CARRY' | 'ISOLATION' | 'CONDITIONING';
  exerciseCount: number;
  iconName?: string;
  color: string;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
