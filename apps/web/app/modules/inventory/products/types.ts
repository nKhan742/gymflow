import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IProducts extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IProductsFilters {
  search?: string;
  status?: StatusType;
}
