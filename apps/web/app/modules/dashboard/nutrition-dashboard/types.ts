export interface IDietConsultationItem {
  id: string;
  clientName: string;
  clientAvatar?: string;
  consultationTime: string;
  dietType: string;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  allergies?: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface IMealProtocolItem {
  id: string;
  protocolName: string;
  assignedClientsCount: number;
  avgCalorieTarget: number;
  macroSplit: string;
  categoryTag: string;
}

export interface INutritionDashboardStats {
  activeDietClientsCount: number;
  caloricAdherenceRatePercent: number;
  consultationsTodayCount: number;
  activeMealProtocolsCount: number;
}
