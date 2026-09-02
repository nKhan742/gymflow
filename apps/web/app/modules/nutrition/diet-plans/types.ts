export type DietGoal = 'LEAN_BULK' | 'FAT_LOSS_CUT' | 'BODY_RECOMP' | 'ENDURANCE_FUEL' | 'KETO_SHRED' | 'CLEAN_MAINTENANCE';

export interface IPlanMealScheduleItem {
  mealOrder: number;
  mealTime: string;
  slotTitle: string;
  mealName: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  cues?: string;
}

export interface IDietPlan {
  id: string;
  _id?: string;
  code?: string;
  name: string;
  goal: DietGoal;
  dailyTargetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  waterTargetLiters: number;
  durationWeeks: number;
  dailyMealsCount: number;
  mealSchedule: IPlanMealScheduleItem[];
  leadNutritionistName: string;
  enrolledAthletesCount: number;
  adherenceRatePercent: number;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDietPlanFilters {
  search?: string;
  goal?: DietGoal | 'ALL';
  branchId?: string;
  status?: 'active' | 'archived';
}

