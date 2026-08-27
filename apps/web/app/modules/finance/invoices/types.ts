import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IInvoices extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IInvoicesFilters {
  search?: string;
  status?: StatusType;
}
