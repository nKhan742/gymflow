export type HydrationStatus = 'OPTIMAL_PEAK' | 'ADEQUATE' | 'MILD_DEFICIT' | 'SEVERE_DEHYDRATION';

export interface IHourlyFluidLog {
  timeSlot: string;
  amountMl: number;
  fluidType: 'FILTERED_WATER' | 'ELECTROLYTE_MATRIX' | 'BCAA_HYDRATION' | 'COCONUT_WATER' | 'MINERAL_WATER';
  loggedTimestamp: string;
}

export interface IWaterIntakeLog {
  id: string;
  _id?: string;
  code?: string;
  memberName: string;
  memberId: string;
  memberEmail?: string;
  memberAvatar?: string;
  logDate: string;
  targetVolumeMl: number;
  consumedVolumeMl: number;
  hourlyLogs: IHourlyFluidLog[];
  electrolyteScorePercent: number;
  hydrationStatus: HydrationStatus;
  sweatLossReplenishedMl: number;
  sodiumMg: number;
  potassiumMg: number;
  magnesiumMg: number;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'archived';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWaterIntakeFilters {
  search?: string;
  hydrationStatus?: HydrationStatus | 'ALL';
  branchId?: string;
  date?: string;
}

