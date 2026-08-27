import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IRevenueAnalytics extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IRevenueAnalyticsFilters {
  search?: string;
  status?: StatusType;
}
