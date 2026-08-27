import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IWorkingHours extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IWorkingHoursFilters {
  search?: string;
  status?: StatusType;
}
