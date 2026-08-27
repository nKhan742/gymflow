import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IWaterIntake extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IWaterIntakeFilters {
  search?: string;
  status?: StatusType;
}
