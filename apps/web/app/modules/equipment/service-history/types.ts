import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IServiceHistory extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IServiceHistoryFilters {
  search?: string;
  status?: StatusType;
}
