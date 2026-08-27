import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IDashboardAnalytics extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IDashboardAnalyticsFilters {
  search?: string;
  status?: StatusType;
}
