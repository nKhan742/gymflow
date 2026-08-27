import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IVisitors extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IVisitorsFilters {
  search?: string;
  status?: StatusType;
}
