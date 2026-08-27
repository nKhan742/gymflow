import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IPayments extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IPaymentsFilters {
  search?: string;
  status?: StatusType;
}
