import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITrainerCommission extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITrainerCommissionFilters {
  search?: string;
  status?: StatusType;
}
