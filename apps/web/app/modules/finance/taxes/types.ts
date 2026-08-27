import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITaxes extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITaxesFilters {
  search?: string;
  status?: StatusType;
}
