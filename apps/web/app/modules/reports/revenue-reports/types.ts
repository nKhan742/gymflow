import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IRevenueReports extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IRevenueReportsFilters {
  search?: string;
  status?: StatusType;
}
