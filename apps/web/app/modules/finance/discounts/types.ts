import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IDiscounts extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IDiscountsFilters {
  search?: string;
  status?: StatusType;
}
