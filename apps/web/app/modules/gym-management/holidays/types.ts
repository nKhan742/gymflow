import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IHolidays extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IHolidaysFilters {
  search?: string;
  status?: StatusType;
}
