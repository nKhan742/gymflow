export type DietaryClassification = 'HIGH_PROTEIN' | 'KETO' | 'VEGAN' | 'VEGETARIAN' | 'PALEO' | 'LOW_CARB' | 'MEDITERRANEAN' | 'HALAL' | 'GLUTEN_FREE';

export type MealCategory = 'BREAKFAST' | 'PRE_WORKOUT' | 'POST_WORKOUT' | 'LUNCH' | 'DINNER' | 'SNACK' | 'SMOOTHIE_SHAKE';

export interface IIngredient {
  name: string;
  amount: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface IMeal {
  id: string;
  _id?: string;
  code?: string;
  name: string;
  mealCategory: MealCategory;
  dietaryType: DietaryClassification;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  prepTimeMinutes: number;
  servings: number;
  image: string;
  ingredients: IIngredient[];
  instructions: string[];
  allergens: string[];
  glycemicIndex?: 'LOW' | 'MEDIUM' | 'HIGH';
  isSmoothieBarAvailable?: boolean;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMealFilters {
  search?: string;
  mealCategory?: MealCategory | 'ALL';
  dietaryType?: DietaryClassification | 'ALL';
  branchId?: string;
  status?: 'active' | 'archived';
}

