export type AdherenceStatus = 'OPTIMAL_ON_TRACK' | 'CALORIE_SURPLUS' | 'CALORIE_DEFICIT' | 'PROTEIN_DEFICIT' | 'MISSED_LOG';

export interface ILoggedMealItem {
  mealSlot: string;
  foodName: string;
  timeLogged: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  photoUrl?: string;
}

export interface INutritionLog {
  id: string;
  _id?: string;
  code?: string;
  memberName: string;
  memberId: string;
  memberEmail?: string;
  memberAvatar?: string;
  logDate: string;
  targetCalories: number;
  consumedCalories: number;
  targetProteinGrams: number;
  consumedProteinGrams: number;
  targetCarbsGrams: number;
  consumedCarbsGrams: number;
  targetFatsGrams: number;
  consumedFatsGrams: number;
  adherenceStatus: AdherenceStatus;
  adherenceScorePercent: number;
  waterIntakeLiters: number;
  loggedMeals: ILoggedMealItem[];
  coachFeedback?: string;
  reviewedByCoachName?: string;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface INutritionLogFilters {
  search?: string;
  adherenceStatus?: AdherenceStatus | 'ALL';
  branchId?: string;
  date?: string;
}

