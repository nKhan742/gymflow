import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IWorkoutPlans extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IWorkoutPlansFilters {
  search?: string;
  status?: StatusType;
}
