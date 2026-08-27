import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IPos extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IPosFilters {
  search?: string;
  status?: StatusType;
}
