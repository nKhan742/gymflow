import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IPersonalTraining extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IPersonalTrainingFilters {
  search?: string;
  status?: StatusType;
}
