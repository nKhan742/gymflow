import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ICalendar extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ICalendarFilters {
  search?: string;
  status?: StatusType;
}
