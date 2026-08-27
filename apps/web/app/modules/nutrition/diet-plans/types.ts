import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IDietPlans extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IDietPlansFilters {
  search?: string;
  status?: StatusType;
}
