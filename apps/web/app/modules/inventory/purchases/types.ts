import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IPurchases extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IPurchasesFilters {
  search?: string;
  status?: StatusType;
}
