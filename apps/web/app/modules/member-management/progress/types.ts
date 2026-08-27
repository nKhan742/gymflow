import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IProgress extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IProgressFilters {
  search?: string;
  status?: StatusType;
}
